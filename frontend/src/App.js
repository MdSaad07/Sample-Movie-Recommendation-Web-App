import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Components/Login';
import Register from './Components/Register';
import ForgotPassword from './Components/ForgotPassword';
import MovieApp from './Components/MovieApp';
import Chatbot from './Components/Chatbot'; // Import Chatbot
import './App.css'; // Import global styles

const Footer = () => (
  <footer className="footer">
    <p>Developed by Mohammed Saad Fazal</p>
    <p>e-mail: mdsaad7803@gmail.com</p>
  </footer>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    const handlePopState = () => {
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/movies" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/movies" element={<MovieApp />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/chatbot" element={<Chatbot />} /> {/* Chatbot Route */}
        </Routes>

        {/* Footer Always Visible */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
