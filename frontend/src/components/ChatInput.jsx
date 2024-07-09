import React, { useState, useRef } from "react";
import { Badge, Box, IconButton, InputBase, Paper } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

/**
 * ChatInput component provides an input field for typing messages and attaching files.
 *
 * @param {Object} props - The component props
 * @param {function} props.handleNewMessage - Function to handle sending new messages
 */
const ChatInput = ({ handleNewMessage }) => {
  const [textInput, setTextInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  /**
   * Handles file input change event
   *
   * @param {Event} event - The file input change event
   */
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  /**
   * Handles sending the message
   */
  const handleSendMessage = () => {
    if (textInput.trim() || selectedFile) {
      handleNewMessage({ message: textInput, file: selectedFile });
      setTextInput("");
      setSelectedFile(null);
    }
  };

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        position: "fixed",
        bottom: "20px",
        width: "80%",
        marginLeft: "2%",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <IconButton onClick={() => fileInputRef.current.click()}>
        <Badge badgeContent={selectedFile !== null ? 1 : 0} color="info">
          <AttachFileIcon />
        </Badge>
      </IconButton>
      <InputBase
        sx={{ flex: 1, marginLeft: "8px" }}
        placeholder="Type a message..."
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      />
      <IconButton onClick={handleSendMessage}>
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default ChatInput;
