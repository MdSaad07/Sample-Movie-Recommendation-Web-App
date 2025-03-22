import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [buttonPosition, setButtonPosition] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!formData.username || !formData.password) {
      shiftButton();
    }
  }, [formData.username, formData.password]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setLoginStatus(null);
  };

  const shiftButton = () => {
    if (formData.username && formData.password) {
      setButtonPosition('');
      return;
    }
    const positions = ['shift-left', 'shift-top', 'shift-right', 'shift-bottom'];
    let nextPosition;
    
    if (!buttonPosition) {
      const randomIndex = Math.floor(Math.random() * positions.length);
      nextPosition = positions[randomIndex];
    } else {
      const currentIndex = positions.indexOf(buttonPosition);
      const nextIndex = (currentIndex + 1) % positions.length;
      nextPosition = positions[nextIndex];
    }
    
    setButtonPosition(nextPosition);
  };

  const handleMouseOver = () => {
    if (!formData.username || !formData.password) {
      shiftButton();
    }
  };

  const mockAuthenticate = async (username, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return username === 'mdsaad7803@gmail.com' && password === '12345678';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) return;

    setIsLoading(true);
    
    try {
      const isAuthenticated = await mockAuthenticate(
        formData.username,
        formData.password
      );
      
      if (isAuthenticated) {
        setLoginStatus('success');
        alert('Login successful!');
        localStorage.setItem('isAuthenticated', 'true'); // ✅ Store authentication
        onLoginSuccess();
        navigate('/'); // ✅ Redirect to MovieApp
      } else {
        setLoginStatus('error');
      }
    } catch (error) {
      setLoginStatus('error');
      alert("Login error");
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        {loginStatus === 'error' && (
          <div className="error-message">
            Invalid username or password
          </div>
        )}
        {loginStatus === 'success' && (
          <div className="success-message">
            Login successful!
          </div>
        )}

        <div className="btn-wrapper">
          <button
            type="submit"
            className={`login-button ${buttonPosition}`}
            disabled={!formData.username || !formData.password || isLoading}
            onMouseOver={handleMouseOver}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="additional-links">
          <a href="/forgot-password">Forgot Password?</a>
          <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
