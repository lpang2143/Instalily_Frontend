import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { getAIMessage } from "../api/api";
import { marked } from "marked";
import useLocalStorage from "./LocalStorage";
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

function ChatWindow() {

  const defaultMessage = [{
    role: "assistant",
    content: "Hi, how can I help you today?"
  }];

  const [messages,setMessages] = useState(defaultMessage)
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  const handleSend = async (input) => {
    // console.log('preparing to send!')
    if (input.trim() !== "") {
      // Set user message
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input }]);
      setInput("");

      // Call API & set assistant message
      const newMessage = await getAIMessage(input);

      const chars = newMessage.content.split("");
      let typed = ""
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: typed }]);
      for (let i = 0; i < chars.length; i++) {
        typed += chars[i];
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length-1].content = typed;
          return updatedMessages
        });
        await new Promise(resolve => setTimeout(resolve, 5));
      }
    }
  };

  const [feedback, setFeedback] = useLocalStorage("feedback", {});

  function handleFeedback(messageIndex, feedbackType) {
    console.log(feedbackType);
    setFeedback((prevFeedback) => {
      const updatedFeedback = { ...prevFeedback };

      if (!updatedFeedback[messageIndex]) {
        updatedFeedback[messageIndex] = {};
      }

      if (feedbackType === 'thumbs-up') {
        updatedFeedback[messageIndex] = {
          ...updatedFeedback[messageIndex],
          thumbsUp: !updatedFeedback[messageIndex]?.thumbsUp,
          thumbsDown: false
        };
      } else if (feedbackType === 'thumbs-down') {
        updatedFeedback[messageIndex] = {
          ...updatedFeedback[messageIndex],
          thumbsDown: !updatedFeedback[messageIndex]?.thumbsDown,
          thumbsUp: false
        };
      }
      console.log(updatedFeedback[messageIndex]);

      return updatedFeedback;
    });
  }

  return (
      <div className="messages-container">
          {messages.map((message, index) => (
              <div key={index} className={`${message.role}-message-container`}>
                  {message.content && (
                      <div className={`message ${message.role}-message`}>
                          <div dangerouslySetInnerHTML={{__html: marked(message.content).replace(/<p>|<\/p>/g, "")}}></div>
                          {(message.role === 'assistant' && index !== 0) &&
                          <div className="feedback-icons">
                            {feedback[index] && feedback[index].thumbsUp ? (
                              <ThumbUpAltIcon fontSize="medium" style={{color:'#1b3875'}} onClick={() => handleFeedback(index, 'thumbs-up')} />
                            ) : (
                              <ThumbUpOffAltIcon fontSize="medium" style={{color:'#1b3875'}} onClick={() => handleFeedback(index, 'thumbs-up')} />
                            )}
                            {feedback[index] && feedback[index].thumbsDown ? (
                              <ThumbDownAltIcon fontSize="medium" style={{color:'#1b3875'}} onClick={() => handleFeedback(index, 'thumbs-down')} />
                            ) : (
                              <ThumbDownOffAltIcon fontSize="medium" style={{color:'#1b3875'}} onClick={() => handleFeedback(index, 'thumbs-down')} />
                            )}
                          </div>
                          }
                      </div>
                  )}
              </div>
          ))}
          <div ref={messagesEndRef} />
          <div className="input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend(input);
                  e.preventDefault();
                }
              }}
              rows="3"
            />
            <button className="send-button" onClick={handleSend}>
              Send
            </button>
          </div>
      </div>
);
}

export default ChatWindow;
