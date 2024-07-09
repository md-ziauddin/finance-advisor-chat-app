import React from "react";
import { Box, Button, List, ListItem, ListItemText } from "@mui/material";

/**
 * ThreadList component displays a list of threads and allows the user to start a new chat.
 *
 * @param {Object} props - The component props
 * @param {Array} props.threads - The list of threads to display
 * @param {Function} props.fetchPreviousMessage - Function to fetch previous messages for a selected thread
 * @param {Function} props.handleNewChat - Function to handle starting a new chat
 */
const ThreadList = ({ threads, fetchPreviousMessage, handleNewChat }) => {
  return (
    <Box sx={{ padding: 2 }}>
      {/* Button to start a new chat */}
      <Box sx={{ display: "flex", justifyContent: "center", pb: 1 }}>
        <Button
          variant="outlined"
          sx={{ width: "120px" }}
          onClick={() => handleNewChat()}
        >
          New Chat
        </Button>
      </Box>

      {/* List of threads */}
      <List>
        {threads.map((thread, idx) => (
          <ListItem
            button
            key={thread.id}
            onClick={() => fetchPreviousMessage(thread.id)}
          >
            <ListItemText primary={`Thread ${idx + 1}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ThreadList;
