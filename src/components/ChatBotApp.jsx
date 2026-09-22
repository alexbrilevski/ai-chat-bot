import { useEffect, useState } from "react";
import { v4 } from "uuid";
import "./ChatBotApp.css";

const ChatBotApp = ({
  onGoBack,
  chats,
  setChats,
  activeChat,
  setActiveChat,
  addNewChat,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(chats[0]?.messages || []);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const activeChatObj = chats.find((chat) => chat.id === activeChat);
    setMessages(activeChatObj ? activeChatObj.messages : []);
  }, [chats, activeChat]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim().length === 0) return;

    const newMessage = {
      id: v4(),
      type: "promt",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    if (!activeChat) {
      addNewChat(newMessage);
    } else {
      const updatedMessages = [...messages, newMessage];

      setMessages(updatedMessages);

      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat) {
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      });

      setChats(updatedChats);
    }
    setInputValue("");
    setIsTyping(true);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_CHAT_GPT_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: inputValue }],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const chatResponse = data.choises[0].message.content.trim();

    const newResponse = {
      type: "response",
      text: chatResponse,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedMessagesWithResponse = [...updatedMessages, newResponse];
    setMessages(updatedMessagesWithResponse);
    setIsTyping(false);

    const updatedChatsWithResponse = chats.map((chat) => {
      if (chat.id === activeChat) {
        return { ...chat, messages: updatedChatsWithResponse };
      } else {
        return chat;
      }
    });
    setChats(updatedChatsWithResponse);
  };

  const handleMessageFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleSelectChat = (id) => {
    setActiveChat(id);
  };

  const handleDeleteChat = (e, id) => {
    e.stopPropagation();

    const updatedChats = chats.filter((chat) => chat.id !== id);
    setChats(updatedChats);

    if (activeChat === id) {
      const newActiveChat = updatedChats.length > 0 ? updatedChats[0].id : null;
      setActiveChat(newActiveChat);
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>Chat List</h2>
          <i className="bx bx-edit-alt new-chat" onClick={addNewChat}></i>
        </div>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-list-item${chat.id === activeChat ? " active" : ""}`}
            onClick={() => handleSelectChat(chat.id)}
          >
            <h4>{chat.title}</h4>
            <i
              className="bx bx-x-circle"
              onClick={(e) => handleDeleteChat(e, chat.id)}
            ></i>
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
          {isTyping && <div className="typing">Typing...</div>}
        </div>
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
  );
};

export default ChatBotApp;
