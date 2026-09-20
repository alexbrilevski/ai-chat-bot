import { useState } from "react";
import "./ChatBotApp.css";

const ChatBotApp = ({ onGoBack, chats, setChats }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(chats[0]?.messages || []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim().length === 0) return;

    const newMessage = {
      id: `m-${new Date().toLocaleDateString("en-GB")}-${new Date().toLocaleTimeString()}`,
      type: "promt",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setInputValue("");

    const updatedChats = chats.map((chat, index) => {
      if (index === 0) {
        return { ...chat, messages: updatedMessages };
      }
      return chat;
    });

    setChats(updatedChats);
  };

  const handleMessageFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="chat-app">
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>Chat List</h2>
          <i className="bx bx-edit-alt new-chat"></i>
        </div>
        {chats.map((chat, index) => (
          <div
            key={chat.id}
            className={`chat-list-item${index === 0 ? " active" : ""}`}
          >
            <h4>{chat.title}</h4>
            <i className="bx bx-x-circle"></i>
          </div>
        ))}
      </div>
      <div className="chat-window">
        <div className="chat-title">
          <h3>Chat with AI</h3>
          <i className="bx bx-arrow-back arrow" onClick={onGoBack}></i>
        </div>
        <div className="chat">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${msg.type === "promt" ? "promt" : "response"}`}
            >
              {msg.text} <span>{msg.timestamp}</span>
            </div>
          ))}
          <div className="typing">Typing...</div>
          <form className="msg-form" onSubmit={handleMessageFormSubmit}>
            <i className="fa-solid fa-face-smile emoji"></i>
            <input
              value={inputValue}
              onChange={handleInputChange}
              type="text"
              className="msg-input"
              placeholder="Type a message..."
            />
            <i
              className="fa-solid fa-paper-plane"
              onClick={handleSendMessage}
            ></i>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBotApp;
