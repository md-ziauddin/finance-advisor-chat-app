import React, { useEffect, useState } from "react";
import { Alert, Box, CssBaseline, Snackbar } from "@mui/material";
import ThreadList from "./components/ThreadList";
import ChatScreen from "./components/ChatScreen";
import ChatInput from "./components/ChatInput";
import useCustomReducer from "./hooks/useReducer";

const App = () => {
  const { state, dispatch, TYPES } = useCustomReducer();
  const { threads, messages } = state;

  const [threadId, setThreadId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState({
    open: false,
    message: "",
  });

  /**
   * Fetches the list of threads when the component mounts.
   */
  useEffect(() => {
    async function fetchThread() {
      try {
        const response = await fetch("http://localhost:3000/getThreads");
        const data = await response.json();

        dispatch({
          type: TYPES.UPDATE_THREADS,
          payload: data.data,
        });
      } catch (error) {
        console.log("Unable to fetch threads");
        setErrorState({
          open: true,
          message: "Unable to fetch threads",
        });
      }
    }

    fetchThread();
  }, []);

  /**
   * Fetches the previous messages for a specific thread.
   * @param {string} id - The ID of the thread.
   */
  const fetchPreviousMessage = async (id) => {
    try {
      setThreadId(id);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        threadId: id,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const res = await fetch(
        "http://localhost:3000/previousMessages",
        requestOptions
      );
      const data = await res.json();

      dispatch({
        type: TYPES.UPDATE_MESSAGE_PREVIOUS,
        payload: data.data,
      });
    } catch (error) {
      console.log("Unable to fetch threads");
      setErrorState({
        open: true,
        message: "Unable to fetch threads",
      });
    }
  };

  /**
   * Handles sending a new message, including uploading files if provided.
   * @param {object} param0 - The message and file to be sent.
   */
  const handleNewMessage = async ({ message, file }) => {
    setLoading(true);

    dispatch({
      type: TYPES.UPDATE_MESSAGES,
      payload: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: {
                value: message,
                annotations: [],
              },
            },
          ],
        },
      ],
    });

    try {
      const formdata = new FormData();
      formdata.append("threadId", threadId);
      formdata.append("file", file);
      formdata.append("message", message);

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const url = threadId
        ? "http://localhost:3000/message"
        : "http://localhost:3000/new-message";

      const response = await fetch(url, requestOptions);
      const messagedata = await response.json();

      dispatch({
        type: TYPES.UPDATE_MESSAGES,
        payload: messagedata.messages,
      });
    } catch (error) {
      console.log("Unable to create new message");
      setErrorState({
        open: true,
        message: "Unable to create new message",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles creating a new chat by resetting the thread ID and messages.
   */
  const handleNewChat = async () => {
    setThreadId("");
    dispatch({
      type: TYPES.UPDATE_MESSAGE_PREVIOUS,
      payload: [],
    });
  };

  // Resetting the error state
  useEffect(() => {
    if (errorState.open) {
      const timer = setTimeout(() => {
        setErrorState({
          open: false,
          message: "",
        });
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [errorState]);

  const handleClose = () => {
    setErrorState({
      open: false,
      message: "",
    });
  };

  return (
    <Box>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
        <Box
          sx={{
            width: "15%",
            borderRight: "1px solid #ccc",
            bgcolor: "#eee",
            color: "black",
          }}
        >
          <ThreadList
            threads={threads}
            fetchPreviousMessage={fetchPreviousMessage}
            handleNewChat={handleNewChat}
          />
        </Box>
        <Box
          sx={{
            width: "85%",
            bgcolor: "#eee",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <ChatScreen messages={messages} isMessageLoading={loading} />
          <ChatInput handleNewMessage={handleNewMessage} />
        </Box>
      </Box>
      <Snackbar
        open={errorState.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
