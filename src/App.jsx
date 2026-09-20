import { useState } from "react";
import ChatBotStart from "./components/ChatBotStart";
import ChatBotApp from "./components/ChatBotApp";

const App = () => {
  const [isChatting, setIsChatting] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const handleAddChat = () => {
    const newChat = {
      id: `c-${new Date().toLocaleDateString("en-GB")}-${new Date().toLocaleTimeString()}`,
      title: `Chat ${new Date().toLocaleDateString("en-GB")} ${new Date().toLocaleTimeString()}`,
      messages: [],
    };

    setChats((prevChats) => [newChat, ...prevChats]);
    setActiveChat(newChat.id);
  };

  const handleGoBack = () => {
    setIsChatting(false);
  };

  const handleStartChat = () => {
    setIsChatting(true);

    if (chats.length === 0) {
      handleAddChat();
    }
  };

  return (
    <div className="container">
      {isChatting ? (
        <ChatBotApp
          onGoBack={handleGoBack}
          chats={chats}
          setChats={setChats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          addNewChat={handleAddChat}
        />
      ) : (
        <ChatBotStart onStartChat={handleStartChat} />
      )}
    </div>
  );
};

export default App;
