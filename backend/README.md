# Finance Advisor Assistant

This is an Express.js application that serves as a finance advisor assistant, leveraging the OpenAI API to provide financial advice. The application allows users to create threads, add messages, upload files, and get responses from the assistant.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Create a New Thread](#create-a-new-thread)
  - [Add a Message to a Thread](#add-a-message-to-a-thread)
  - [Handle New Messages](#handle-new-messages)
  - [Get Previous Messages](#get-previous-messages)
  - [Get All Threads](#get-all-threads)
  - [Create a New Assistant](#create-a-new-assistant)
- [License](#license)

## Description

Finance Advisor Assistant is an application that provides financial advice using OpenAI's Assistant API. The application allows users to create threads of conversation, add messages (with optional file uploads), and receive intelligent responses from an AI assistant. This can be useful for getting professional financial advice and detailed responses to finance-related queries.

## Features

- Create new conversation threads.
- Add messages to existing threads.
- Upload files to be processed by the assistant.
- Retrieve previous messages from a thread.
- List all conversation threads.
- Create a new assistant with specific instructions and models.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/finance-advisor-assistant.git
   cd finance-advisor-assistant
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your OpenAI API key and Assistant ID:

   ```
   OPENAI_API_KEY=your_openai_api_key
   ASSISTANT_ID=your_assistant_id
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Usage

Once the server is running, you can use the API endpoints to interact with the finance advisor assistant. Below are the details of the available endpoints.

## API Endpoints

### Create a New Thread

**Endpoint:**

```
GET /thread
```

**Description:**
Creates a new conversation thread.

**Response:**

```json
{
  "threadId": "thread_id"
}
```

### Add a Message to a Thread

**Endpoint:**

```
POST /message
```

**Description:**
Adds a message to an existing thread and optionally uploads a file.

**Parameters:**

- `message` (string): The message content.
- `threadId` (string): The ID of the thread.
- `file` (file, optional): A file to be uploaded.

**Response:**

```json
{
  "messages": [
    {
      "id": "message_id",
      "content": "message_content",
      "newMessage": true
    }
  ]
}
```

### Handle New Messages

**Endpoint:**

```
POST /new-message
```

**Description:**
Handles new messages by creating a new thread, adding a message, and running the assistant.

**Parameters:**

- `message` (string): The message content.
- `file` (file, optional): A file to be uploaded.

**Response:**

```json
{
  "messages": [
    {
      "id": "message_id",
      "content": "message_content",
      "newMessage": true
    }
  ]
}
```

### Get Previous Messages

**Endpoint:**

```
POST /previousMessages
```

**Description:**
Retrieves previous messages from a thread.

**Parameters:**

- `threadId` (string): The ID of the thread.

**Response:**

```json
{
  "data": [
    {
      "id": "message_id",
      "content": "message_content"
    }
  ]
}
```

### Get All Threads

**Endpoint:**

```
GET /getThreads
```

**Description:**
Retrieves all conversation threads.

**Response:**

```json
{
  "data": [
    {
      "id": "thread_id",
      "created_at": "timestamp"
    }
  ]
}
```

### Create a New Assistant

**Endpoint:**

```
POST /create-assistance
```

**Description:**
Creates a new assistant with specific instructions and models.

**Parameters:**

- `name` (string): The name of the assistant.
- `instructions` (string): Instructions for the assistant.
- `model` (string): The model to be used by the assistant.

**Response:**

```json
{
  "data": {
    "id": "assistant_id",
    "name": "assistant_name",
    "instructions": "assistant_instructions",
    "model": "model_name"
  }
}
```

## License

This project is licensed under the MIT License.
