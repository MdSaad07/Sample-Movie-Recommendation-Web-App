﻿# 🎬 Movie Recommendation System

Welcome to the **Movie Recommendation System**! This full-stack web application allows users to register, log in, search for movies, get recommendations, and interact with a chatbot. 

## 🚀 Features
- 🔐 **User Authentication** (Register & Login)
- 🎞️ **Search for Movies**
- 🤖 **Chatbot Integration** (Powered by Hugging Face API)
- 🎥 **AI-Based Movie Recommendations**
- 🔧 **MongoDB Database Management**

## 🖥️ Tech Stack
**Frontend:** React, HTML, CSS  
**Backend:** Node.js, Express.js, MongoDB  
**AI Model:** Hugging Face Transformers  
**Authentication:** JWT & Bcrypt  

## 📸 Screenshots
| Feature | Screenshot |
|---------|------------|
| 📝 Register | ![Create Account](screenshots/create_account.png) |
| 🔑 Login | ![Login](screenshots/login.png) |
| 🔄 Forgot Password | ![Forgot Password](screenshots/forgot_Password.png) |
| 🎬 Display Movies (Top) | ![Display Movies Top](screenshots/display_movies_top.png) |
| 🎬 Display Movies (Bottom) | ![Display Movies Bottom](screenshots/display_movies_bottom.png) |
| 🔎 Search Movies | ![Search](screenshots/search.png) |
| 🎥 Recommendations | ![Recommendations](screenshots/recommendations.png) |
| 🗄️ MongoDB Setup | ![MongoDB](screenshots/mongodb.png) |

## 🛠️ Installation
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-repo.git
cd movie-recommendation-system
```

### **2️⃣ Set Up Backend**
1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend` directory and add:
   ```env
   MONGO_URI=mongodb://localhost:27017/movie/test
   JWT_SECRET=your_jwt_secret
   PORT=5000
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```
3. Start the backend:
   ```sh
   npm start
   ```

### **3️⃣ Set Up Frontend**
1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```sh
   npm start
   ```

### **4️⃣ MongoDB Compass Setup**
1. Download & install MongoDB Compass from [here](https://www.mongodb.com/try/download/compass).
2. Start MongoDB Server:
   ```sh
   mongod
   ```
3. Open MongoDB Compass and connect using:
   ```
   mongodb://localhost:27017
   ```
4. Create a new database (`movieDB`) and a collection (`movies`).

## 📜 API Endpoints
| Method | Endpoint | Description |
|--------|------------|----------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user & get token |
| GET | `/movies?search=query` | Search movies |
| GET | `/movie/:id` | Get movie details |
| POST | `/recommend` | Get movie recommendations |
| POST | `/chatbot` | Chat with AI chatbot |

## 📜 Dependencies
### **Backend**
- Express
- Mongoose
- CORS
- Bcrypt
- JSON Web Token (JWT)
- Hugging Face Inference API

### **Frontend**
- React
- React Router
- Axios

## 💡 Contributing
Feel free to submit pull requests! 🚀

## 📝 License
MIT License

