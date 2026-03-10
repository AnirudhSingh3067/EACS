# 🧠 MindBridge – AI Powered Mental Health Platform

MindBridge is a modern **AI-powered mental health support platform** designed to help users reflect, express emotions, and receive supportive guidance through intelligent conversations.

The platform combines a **modern web interface with a secure backend and an AI conversation engine** to provide a safe environment for emotional support and mental well-being.

---

# ✨ Features

## 🎯 User Features

* **AI Mental Health Chat** – Talk with an AI assistant for emotional support
* **Session Tracking** – Manage and review past conversations
* **Journal System** – Write and store personal reflections
* **Weekly Reflections** – Guided prompts for mental clarity
* **User Authentication** – Secure login and profile management
* **Responsive Design** – Works smoothly on desktop and mobile

---

## 🔧 Platform Features

* **Secure Authentication** – Firebase authentication system
* **AI Conversation Engine** – Powered by modern LLM APIs
* **Fast API Backend** – High performance Python backend
* **Scalable Architecture** – Frontend, backend, and AI services separated
* **Modern UI** – Clean and intuitive interface

---

# 🛠 Tech Stack

## Frontend

* **Next.js / React.js** – User interface framework
* **TypeScript** – Type-safe development
* **Tailwind CSS** – Modern responsive styling
* **Axios / Fetch API** – API communication
* **Context API** – Global state management

---

## Backend

* **Node.js / API Layer** – Application backend services
* **Python FastAPI** – AI processing backend
* **Firebase Authentication** – Secure user authentication
* **HTTPX** – Async API requests
* **Pydantic** – Data validation

---

## AI Engine

* **Groq API** – AI response generation
* **OpenAI compatible API** – Language model integration
* **Python NLP Processing** – AI message analysis

---

# 📁 Project Structure

```
mindbridge/
├── client/                     # Frontend (Next.js / React)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/              # Application pages
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # API services
│   │   └── App.js              # Main application
│   └── package.json
│
├── server/                     # Backend API
│   ├── routers/                # API routes
│   ├── middleware/             # Auth & validation
│   ├── config.py               # Configuration
│   ├── firebase.py             # Firebase authentication
│   └── main.py                 # FastAPI server entry
│
├── ai-engine/                  # AI processing logic
│   ├── ai_model.py             # AI conversation logic
│   └── requirements.txt
│
└── README.md
```

---

# ⚙️ System Architecture

```
Frontend (Next.js / React)
        │
        ▼
Backend API (Node.js / FastAPI)
        │
        ▼
AI Engine (Python + Groq API)
```

---

# 🚀 Installation & Setup

## Prerequisites

* Node.js (v18+)
* Python (3.11+)
* Firebase Project
* Groq API Key
* Git

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/mindbridge.git
cd mindbridge
```

---

## 2️⃣ Backend Setup

```bash
cd server
pip install -r requirements.txt
```

Create `.env` file:

```
GROQ_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:9002
```

Start backend:

```bash
uvicorn main:app --reload
```

Backend will run on:

```
http://localhost:8000
```

---

## 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:9002
```

---

# 📡 API Endpoints

## 🔐 Authentication

* `POST /api/auth/register` – User registration
* `POST /api/auth/login` – User login
* `GET /api/auth/me` – Get current authenticated user
* `PUT /api/auth/profile` – Update user profile

---

## 🤖 AI Chat

* `POST /api/chat/message` – Send message to AI assistant
* `GET /api/chat/history` – Get conversation history
* `DELETE /api/chat/history` – Clear chat history

---

## 🧠 Sessions

* `POST /api/session/start` – Start mental health session
* `POST /api/session/end` – End current session
* `GET /api/session/history` – Get session history

---

## 📔 Journal

* `POST /api/journal` – Create journal entry
* `GET /api/journal` – Get journal entries
* `PUT /api/journal/:id` – Update entry
* `DELETE /api/journal/:id` – Delete entry

---

## 💬 Feedback

* `POST /api/feedback` – Submit feedback
* `GET /api/feedback` – Get feedback (admin)

---

## 🩺 System

* `GET /api/health` – Check backend status

Example response:

```json
{
  "status": "ok",
  "message": "MindBridge backend running"
}
```

---

# 🔐 Security

* Firebase secure authentication
* Token-based API requests
* Environment variable configuration
* Input validation using Pydantic

---

# 🎨 UI / UX Features

* Modern clean design
* Dark mode friendly interface
* Smooth interactions
* Accessible layout

---

# 🌐 Deployment

## Backend Deployment

Recommended platforms:

* **Render**
* **Railway**
* **Fly.io**

Start command:

```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## Frontend Deployment

Recommended platforms:

* **Vercel**
* **Netlify**

Build command:

```
npm run build
```

---

# 🤝 Contributing

1. Fork the repository

```
git checkout -b feature/new-feature
```

2. Commit your changes

```
git commit -m "Add new feature"
```

3. Push to the branch

```
git push origin feature/new-feature
```

4. Open a Pull Request

---

# 📝 License

This project is licensed under the **MIT License**.

---

# 🙏 Acknowledgments

* Next.js
* FastAPI
* Groq AI
* Firebase
* Tailwind CSS

---

# 💬 Support

If you have questions or suggestions:

* Open a GitHub issue
* Contact the project maintainer



