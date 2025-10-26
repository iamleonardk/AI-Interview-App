# 🧠 AI-Powered Interview Prep App

An **AI-driven full-stack web application** that helps job seekers **prepare for technical interviews**.
Simply upload your **resume** and **job description**, and practice with **AI-generated interview questions** tailored to your profile.
Receive **instant feedback**, scores, and improvement tips — all powered by **RAG (Retrieval-Augmented Generation)**.

---

## 🚀 Features

* 🔐 **User Authentication** — Secure signup/login with JWT tokens
* 📄 **Document Upload** — Upload your **resume** and **job description** (PDF, max 2MB)
* 🤖 **AI Interview Questions** — Smartly generated from job description context
* 💬 **Real-time Chat Interface** — Simulates a real interview experience
* 🧩 **Smart Feedback Engine** —
  * AI evaluates your answers against your resume
  * Provides a **score (1–10)**
  * Gives **actionable feedback** and **improvement suggestions**
* 🔍 **RAG System** — Embedding-based similarity search to fetch relevant context from your resume & job description
* 📱 **Responsive UI** — Mobile-friendly design using Tailwind CSS

---

## 🧰 Tech Stack

### 🖥️ Frontend

* **React 19**
* **React Router** — Routing and protected routes
* **Tailwind CSS** — Styling
* **Axios** — API integration
* **React Hot Toast** — Notifications
* **Vite** — Lightning-fast build tool

### ⚙️ Backend

* **Node.js + Express.js**
* **MongoDB Atlas** — Cloud database
* **JWT** — Authentication
* **OpenAI API (GPT-3.5-Turbo & text-embedding-3-small)** — AI generation and embeddings
* **Multer** — File upload handling
* **PDF-Parse** — Extracts text from PDFs
* **Bcrypt** — Password hashing
* **Express Rate Limit** — API protection

---

## 🧾 Prerequisites

Make sure you have the following installed:

* **Node.js** v16+
* **MongoDB Atlas** account
* **OpenAI API key**

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/AI-Interview-App.git
cd AI-Interview-App
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-prep?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

Server runs at: **http://localhost:5000**

### Start Frontend

```bash
cd frontend
npm run dev
```

App runs at: **http://localhost:5173**

---

## 🧑‍💻 Usage Guide

1. **Sign Up / Login**  
   Create an account securely with JWT authentication.

2. **Upload Documents**
   * Upload **Resume (PDF)**
   * Upload **Job Description (PDF)**

3. **Start Interview**  
   Click "Proceed to Interview" to start your AI-powered mock session.

4. **Chat with the AI**
   * Answer dynamically generated questions
   * Get **real-time scores and feedback**

5. **Review Session**  
   Analyze your performance and see where to improve.

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | User login |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload a PDF document |
| GET | `/api/documents/list` | Fetch uploaded documents |
| GET | `/api/documents/check` | Check if both docs uploaded |
| DELETE | `/api/documents/:id` | Delete document |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/start` | Start an interview session |
| POST | `/api/chat/query` | Send user response & get AI reply |
| GET | `/api/chat/history` | Fetch previous chat history |
| POST | `/api/chat/end` | End the interview session |

---

## 🗂️ Project Structure

```
AI-Interview-App/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   └── documentController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Document.js
│   │   │   └── Chat.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   └── documentRoutes.js
│   │   └── utils/
│   │       ├── openai.js
│   │       ├── pdfParser.js
│   │       └── tokenGenerator.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Upload.jsx
│   │   │   └── Chat.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
└── README.md
```
