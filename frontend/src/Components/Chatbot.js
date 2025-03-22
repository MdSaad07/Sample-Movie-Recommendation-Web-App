import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Add styles if needed

function Chatbot() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    setChat([...chat, userMessage]);

    try {
      const response = await axios.post('http://localhost:5000/chatbot', { message });
      const botReply = { sender: 'bot', text: response.data.reply };
      setChat([...chat, userMessage, botReply]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setChat([...chat, userMessage, { sender: 'bot', text: 'Error fetching response' }]);
    }

    setMessage('');
  };

  return (
    <div className="chatbot-container">
      <h2>Movie Chatbot</h2>
      <div className="chatbox">
        {chat.map((msg, index) => (
          <p key={index} className={msg.sender}>{msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me about movies..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chatbot;
