import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ReactMarkdown from "react-markdown";
import TypingEffectMarkdown from "./TypingEffectMarkdown";

/**
 * ChatScreen component displays the chat messages and handles scrolling to the bottom.
 *
 * @param {Object} props - The component props
 * @param {Array} props.messages - The list of messages to display
 * @param {boolean} [props.isMessageLoading=false] - Indicates if a new message is loading
 */
const ChatScreen = ({ messages, isMessageLoading = false }) => {
  const chatEndRef = useRef(null);

  /**
   * Scroll to the bottom of the chat messages.
   */
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        height: "calc(100vh - 56px)",
        overflowY: "auto",
        padding: "16px",
        paddingBottom: "40px",
        backgroundColor: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: messages.length === 0 ? "center" : "flex-start",
      }}
    >
      {messages.length === 0 ? (
        <Typography variant="body1">
          No chats to show. Start a new chat.
        </Typography>
      ) : (
        <>
          {messages.map((message, index) => (
            <Box
              key={message.id}
              sx={{
                margin: "8px 0",
                display: "flex",
                justifyContent:
                  message.role === "user" ? "flex-end" : "flex-start",
                width: "100%",
              }}
            >
              <Paper
                sx={{
                  padding: "12px",
                  borderRadius: "12px",
                  maxWidth: "70%",
                  backgroundColor:
                    message.role === "user" ? "#e0f7fa" : "#ffffff",
                  position: "relative",
                }}
              >
                {message.role === "assistant" &&
                  message.content.some((content) =>
                    content.text.annotations?.some(
                      (annotation) => annotation.file_citation?.file_id
                    )
                  ) && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: "-24px",
                        transform: "translateY(-50%)",
                      }}
                      aria-label="Attachment"
                    >
                      <AttachFileIcon />
                    </IconButton>
                  )}
                {message.content.map((content, idx) => (
                  <Typography key={idx} variant="body1">
                    {message.newMessage && index === messages.length - 1 ? (
                      <TypingEffectMarkdown
                        text={content.text.value}
                        speed={10}
                      />
                    ) : (
                      <ReactMarkdown key={idx} children={content.text.value} />
                    )}
                  </Typography>
                ))}
              </Paper>
            </Box>
          ))}
          {isMessageLoading && (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          )}
          <div
            ref={chatEndRef}
            style={{ height: "82px", visibility: "hidden", marginTop: "100px" }}
          />
        </>
      )}
    </Box>
  );
};

export default ChatScreen;
