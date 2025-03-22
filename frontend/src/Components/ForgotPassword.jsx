import React, { useState } from 'react';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // In a real app, you would call your API here to send a reset link
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="forgot-password-container">
      {!isSubmitted ? (
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>
          <p className="form-description">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
            />
            {error && <span className="error">{error}</span>}
          </div>
          
          <button type="submit" className="reset-button">Send Reset Link</button>
          
          <div className="additional-links">
            <a href="#">Back to Login</a>
          </div>
        </form>
      ) : (
        <div className="confirmation-message">
          <h2>Check Your Email</h2>
          <p>
            We've sent a password reset link to <strong>{email}</strong>.
            Please check your inbox and follow the instructions to reset your password.
          </p>
          <p className="small-text">
            If you don't see the email, check your spam folder or
            <button 
              className="resend-link" 
              onClick={() => console.log('Resend email to:', email)}
            >
              click here to resend
            </button>.
          </p>
          <div className="additional-links centered">
            <a href="/">Back to Login</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;