````markdown
# Finance Advisor Chat Application

This repository contains both the frontend and backend components of the Finance Advisor Chat Application, allowing users to interact with an AI-powered assistant for financial advice.

## Project Structure

```
.
├── backend
│   ├── package.json
│   ├── server.js
│   └── ...
└── frontend
    ├── package.json
    ├── src
    └── ...
```
````

## Prerequisites

- Node.js (>= 18.x)
- npm (>= 9.x)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/md-ziauddin/finance-advisor-chat-app.git
cd finance-advisor-chat-app
```

### 2. Setup Backend

Navigate to the backend directory and install the dependencies:

```bash
cd backend
npm install
```

or

```bash
yarn install
```

Start the backend server:

```bash
npm start
```

or

```bash
yarn start
```

By default, the backend server will run on `http://localhost:3000`.

### 3. Setup Frontend

Navigate to the frontend directory and install the dependencies:

```bash
cd ../frontend
npm install
```

or

```bash
yarn install
```

Start the frontend development server:

```bash
npm start
```

or

```bash
yarn start
```

By default, the frontend server will run on `Check console for the URL`.

## Environment Variables

Ensure that the frontend application is configured to make API calls to the backend server. You might need to set environment variables for API URLs.

### Backend

Create a `.env` file in the `backend` directory with the following content:

```plaintext
PORT=3000
OPENAI_API_KEY=<------API_KEY----->
ASSISTANT_ID=<-----ASSISTANT_ID------>
# Add other environment variables here
```

## API Endpoints

### Backend

- `GET /getThreads`: Fetches the list of chat threads.
- `POST /previousMessages`: Fetches previous messages for a given thread ID.
- `POST /message`: Sends a new message to an existing thread.
- `POST /new-message`: Starts a new thread with the given message.

## Frontend

## Description

The Finance Advisor Chat Application allows users to interact with an AI-powered assistant to get financial advice. The application supports chat threads, real-time messaging, and file attachments. It is built using React.js, Material-UI, and integrates with a backend server to fetch and store chat data.

## Features

- Multiple chat threads
- Real-time messaging
- File attachments
- Dynamic chat loading with a smooth scrolling effect
- Typing indicator for new messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
