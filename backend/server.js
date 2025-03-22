const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { HfInference } = require('@huggingface/inference');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Fixed CORS

// Hugging Face API Key (store in .env)
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB Connected to database: test"))
  .catch(err => console.error("MongoDB connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

// Movie Schema
const MovieSchema = new mongoose.Schema({
  title: String,
  description: String,
  genre: String,
  rating: Number
});
const Movie = mongoose.model('Movie', MovieSchema);

// Register User
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login User
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Search Movies
app.get('/movies', async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let filter = {};

    if (searchQuery) {
      filter = {
        $or: [
          { title: new RegExp(searchQuery, 'i') },
          { genre: new RegExp(searchQuery, 'i') }
        ]
      };
    }

    const movies = await Movie.find(filter, 'title year genre rating description -_id');

    if (movies.length === 0) {
      return res.status(404).json({ message: 'No movies found' });
    }

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Get Movie Details
app.get('/movie/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

// Recommend Movies using Hugging Face Transformers
app.post('/recommend', async (req, res) => {
  try {
      const { user_input } = req.body;
      if (!user_input) {
          return res.status(400).json({ error: 'User input is required' });
      }

      // Set timeout in case Hugging Face API is slow
      const hfResponse = await Promise.race([
          hf.textGeneration({
              model: "facebook/blenderbot-400M-distill",
              inputs: `I am looking for a movie recommendation. My preferences are: ${user_input}`,
              parameters: { max_new_tokens: 50 }
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("API Timeout")), 10000)) // 10s timeout
      ]);

      if (!hfResponse || !hfResponse.generated_text) {
          return res.status(500).json({ error: "Invalid response from Hugging Face API" });
      }

      res.json({ recommendation: hfResponse.generated_text });

  } catch (error) {
      console.error("Hugging Face API error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch recommendations from Hugging Face" });
  }
});


app.post('/chatbot', async (req, res) => {
  try {
      const { message } = req.body;

      if (!message) {
          return res.status(400).json({ error: 'Message is required' });
      }

      console.log("Received user message:", message); // Debugging

      const response = await hf.textGeneration({
          model: "facebook/blenderbot-3B", // You can change this to a different model if needed
          inputs: message
      });

      console.log("Hugging Face response:", response); // Debugging

      if (!response.generated_text) {
          return res.status(500).json({ error: "No response from Hugging Face API." });
      }

      res.json({ reply: response.generated_text });

  } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({ error: "Failed to process chatbot request." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
