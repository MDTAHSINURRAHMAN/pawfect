import { useState } from "react";
import Navbar from "../components/shared/Navbar";
import AIChatBot from "../pages/AIChatBot";
const Rescue = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleVolunteerChat = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    // Add user message to chat history
    setChatHistory([...chatHistory, { sender: "user", message: userMessage }]);
    // Here you would typically send the message to your backend/volunteer
    setUserMessage("");
  };


  return (
    <div>
        <Navbar></Navbar>
        <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Pet Rescue Support</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Volunteer Chat Section */}
        <div className="bg-base-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Chat with a Volunteer</h2>
          <div className="bg-white rounded-lg p-4 h-[400px] overflow-y-auto mb-4">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  chat.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span className="inline-block bg-primary text-white rounded-lg px-4 py-2">
                  {chat.message}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleVolunteerChat} className="flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
              className="input input-bordered flex-1"
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
            <div>
                <AIChatBot></AIChatBot>
            </div>
      </div>
        </div>
    </div>
  );
};

export default Rescue;
