import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MovieApp.css";

function MovieApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatResponse, setChatResponse] = useState([]);
  const chatEndRef = useRef(null); // For auto-scrolling
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (query = "") => {
    try {
      const response = await axios.get(`http://localhost:5000/movies?search=${query}`);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchMovies(e.target.value);
  };

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const handleChatSubmit = async () => {
    if (!userMessage.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/chatbot", {
        message: userMessage,
      });

      setChatResponse(prev => [...prev, { type: "user", text: userMessage }, { type: "bot", text: response.data.reply }]);
      setUserMessage(""); // Clear input field
    } catch (error) {
      console.error("Chatbot error:", error);
      setChatResponse(prev => [...prev, { type: "bot", text: "Failed to fetch response." }]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatResponse]);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear stored token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="movie-app">
      {/* Navbar */}
      <nav className="navbar">
        <h2 style={{color:"white"}}>Movie Recommendations</h2>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
        <button className="chatbot-btn" onClick={() => setShowChatbot(true)}>
          Chat with AI 🤖
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout 🚪
        </button>
      </nav>

      {/* Movie List */}
      <div className="movie-list">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
  key={movie._id}
  className="movie-card"
  onClick={() => handleMovieClick(movie._id)}
>
  <h3>{movie.title} ({movie.year})</h3>
  <p><strong>Genre:</strong> {movie.genre}</p>
  <p><strong>Rating:</strong> {movie.rating}</p>
  <p><strong>Description:</strong> {movie.description}</p>
</div>

          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="chatbot-modal">
          <div className="chatbot-content">
            <h3>Movie Chatbot 🤖</h3>
            <div className="chat-messages">
              {chatResponse.map((msg, index) => (
                <p key={index} className={msg.type === "user" ? "user-msg" : "bot-msg"}>
                  {msg.text}
                </p>
              ))}
              <div ref={chatEndRef} />
            </div>
            <textarea
              placeholder="Ask me about movies..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <button onClick={handleChatSubmit}>Send</button>
            <button className="close-btn" onClick={() => setShowChatbot(false)}>
              Close ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieApp;
