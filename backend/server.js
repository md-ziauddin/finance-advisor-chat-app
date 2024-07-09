require("dotenv").config();
const OpenAI = require("openai");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { OPENAI_API_KEY, ASSISTANT_ID } = process.env;

// Setup Express
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Set up OpenAI Client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Path to the threadList file
const filePath = path.join(__dirname, "threadList.json");

// Assistant ID from environment variables
const assistantId = ASSISTANT_ID;
let pollingInterval;

/**
 * Function to create a new thread.
 * This function will create a new thread using OpenAI API and save it to a JSON file.
 */
async function createThread() {
  console.log("Creating a new thread...");
  const newThread = await openai.beta.threads.create();

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // Create the file with initial data
    fs.writeFileSync(filePath, JSON.stringify([newThread], null, 2));
  } else {
    // Read the existing file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        throw new Error("Error reading file");
      }

      // Parse the existing data
      let threadList = [];
      try {
        threadList = JSON.parse(data);
      } catch (err) {
        throw new Error("Error parsing JSON data");
      }

      // Append the new thread
      threadList.push(newThread);

      // Write the updated data back to the file
      fs.writeFile(filePath, JSON.stringify(threadList, null, 2), (err) => {
        if (err) {
          throw new Error("Error writing to file");
        }
      });
    });
  }

  return newThread;
}

/**
 * Function to upload a file.
 * This function uploads a file to OpenAI's API for use with the assistant.
 * @param {string} filePath - The path of the file to be uploaded.
 * @returns {Promise<string>} - The ID of the uploaded file.
 */
async function uploadFile(filePath) {
  console.log("Uploading file: " + filePath);

  const response = await openai.files.create({
    purpose: "assistants",
    file: fs.createReadStream(filePath),
  });

  return response.id;
}

/**
 * Function to add a message to a thread.
 * This function adds a message to the specified thread in OpenAI's API.
 * @param {string} threadId - The ID of the thread.
 * @param {string} message - The message content.
 * @param {string} [fileId] - The ID of the uploaded file, if any.
 * @returns {Promise<object>} - The response from the API.
 */
async function addMessage(threadId, message, fileId) {
  console.log("Adding a new message to thread: " + threadId);

  const requestData = {
    role: "user",
    content: message,
  };

  if (fileId) {
    requestData.file = fileId;
  }

  const response = await openai.beta.threads.messages.create(
    threadId,
    requestData
  );
  return response;
}

/**
 * Function to run the assistant for a thread.
 * This function starts the assistant for the specified thread in OpenAI's API.
 * @param {string} threadId - The ID of the thread.
 * @returns {Promise<object>} - The response from the API.
 */
async function runAssistant(threadId) {
  console.log("Running assistant for thread: " + threadId);
  const response = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  console.log(response);

  return response;
}

/**
 * Function to check the status of an assistant run.
 * This function checks the status of the assistant run and retrieves the messages when completed.
 * @param {object} res - The response object.
 * @param {string} threadId - The ID of the thread.
 * @param {string} runId - The ID of the assistant run.
 */
async function checkingStatus(res, threadId, runId) {
  const runObject = await openai.beta.threads.runs.retrieve(threadId, runId);

  const status = runObject.status;
  console.log(runObject);
  console.log("Current status: " + status);

  if (status === "completed") {
    clearInterval(pollingInterval);

    const messagesList = await openai.beta.threads.messages.list(threadId);
    let messages = [];

    // Will only return the response for the current chat
    messagesList.body.data.slice(0, 1).forEach((message) => {
      messages.push({ ...message, newMessage: true });
    });

    res.json({ messages: messages });
  }
}

/**
 * Function to get previous messages from a thread.
 * This function retrieves the previous messages from the specified thread.
 * @param {string} threadId - The ID of the thread.
 * @returns {Promise<object>} - The response from the API.
 */
async function getPreviousMessage(threadId) {
  console.log("Getting previous message...");
  const thread = await openai.beta.threads.messages.list(threadId);

  return thread;
}

//=========================================================
//============== ROUTE SERVER =============================
//=========================================================

app.use(cors());

// Route to open a new thread
app.get("/thread", async (req, res) => {
  try {
    const thread = await createThread();
    res.json({ threadId: thread.id });
  } catch (error) {
    console.error("Error creating thread: ", error);
    res.status(500).json({ error: "Error creating thread" });
  }
});

// Route to add a message to a thread and run the assistant
app.post("/message", upload.single("file"), async (req, res) => {
  const { message, threadId } = req.body;
  const filePath = req.file ? req.file.path : null;

  let fileId = null;
  if (filePath) {
    try {
      const fileResponse = await uploadFile(filePath);
      fileId = fileResponse.id;
    } catch (error) {
      console.error("File upload failed: ", error);
      res.status(500).json({ error: "File upload failed" });
      return;
    } finally {
      // Clean up uploaded file if exists
      fs.unlinkSync(filePath);
    }
  }

  try {
    const addedMessage = await addMessage(threadId, message, fileId);
    const run = await runAssistant(threadId);
    const runId = run.id;

    pollingInterval = setInterval(() => {
      checkingStatus(res, threadId, runId);
    }, 5000);
  } catch (error) {
    console.error("Error adding message or running assistant: ", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route to handle new messages
app.post("/new-message", upload.single("file"), async (req, res) => {
  console.log("New message endpoint called");

  try {
    const thread = await createThread();
    console.log("Thread created: ", thread.id);

    const { message } = req.body;
    const filePath = req.file ? req.file.path : null;

    let fileId = null;
    if (filePath) {
      try {
        const fileResponse = await uploadFile(filePath);
        fileId = fileResponse.id;
        console.log("File uploaded: ", fileId);
      } catch (error) {
        console.error("File upload failed: ", error);
        res.status(500).json({ error: "File upload failed" });
        return;
      } finally {
        // Clean up uploaded file if exists
        fs.unlinkSync(filePath);
      }
    }

    const addedMessage = await addMessage(thread.id, message, fileId);
    console.log("Message added: ", addedMessage);

    const run = await runAssistant(thread.id);
    const runId = run.id;
    console.log("Assistant run started: ", runId);

    // Check the status
    pollingInterval = setInterval(() => {
      checkingStatus(res, thread.id, runId);
    }, 5000);
  } catch (error) {
    console.error("Error handling new message: ", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route to get previous messages from a thread
app.post("/previousMessages", async (req, res) => {
  const { threadId } = req.body;

  console.log({ threadId });

  try {
    const response = await getPreviousMessage(threadId);
    res.status(200).json({ data: response.data.reverse() });
  } catch (error) {
    console.error("Error getting previous messages: ", error);
    res.status(500).json({ error: "Error getting previous messages" });
  }
});

// Route to get all threads
app.get("/getThreads", (req, res) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          res.status(500).json({ message: "Error reading file" });
        }

        let threadList = [];
        try {
          threadList = JSON.parse(data);
        } catch (err) {
          res.status(500).json({ message: "Error parsing JSON data" });
        }

        res.status(200).json({ data: threadList });
      });
    } else {
      res.status(500).json({ message: "No thread found!" });
    }
  } catch (error) {
    console.error("Error getting threads: ", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route to create a new assistant
app.use("/create-assistance", async (req, res) => {
  const { name, instructions, model } = req.body;
  try {
    const body = {
      name,
      instructions,
      tools: [{ type: "file_search" }],
      model,
    };
    const assistance = await openai.beta.assistants.create(body);

    res.status(200).json({
      data: assistance,
    });
  } catch (error) {
    console.error("Error creating assistance: ", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
