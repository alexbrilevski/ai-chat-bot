import { useEffect, useState } from "react";
import { v4 } from "uuid";
import ChatBotStart from "./components/ChatBotStart";
import ChatBotApp from "./components/ChatBotApp";

const App = () => {
  const [isChatting, setIsChatting] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chats")) || [];
    setChats(storedChats);

    if (storedChats.length > 0) {
      setActiveChat(storedChats[0].id);
    }
  }, []);

  const handleAddChat = (initialMessage = null) => {
    const newChat = {
      id: v4(),
      title: `Chat ${new Date().toLocaleDateString("en-GB")} ${new Date().toLocaleTimeString()}`,
      messages: initialMessage ? [initialMessage] : [],
    };
    const updatedChats = [newChat, ...chats];
    console.log(updatedChats);

    setChats(updatedChats);
    setActiveChat(newChat.id);
    localStorage.setItem("chats", JSON.stringify(updatedChats));
    localStorage.setItem(newChat.id, JSON.stringify(newChat.messages));
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
