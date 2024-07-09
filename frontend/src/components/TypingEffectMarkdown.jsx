import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const TypingEffectMarkdown = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentText = "";
    const timer = setInterval(() => {
      if (currentText.length < text.length) {
        currentText += text[currentText.length];
        setDisplayedText(currentText);
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

export default TypingEffectMarkdown;
