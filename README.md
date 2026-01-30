## 📘 Project Overview

Learna-AI is a **full-stack AI Learning Assistant** built to enhance the way users study, explore concepts, and interact with educational content. The platform leverages modern web technologies and AI integrations to deliver **context-aware, conversational learning experiences** through an intuitive and responsive interface.

The application is designed with scalability and modularity in mind, featuring a **React-based frontend** for seamless user interaction and a **Node.js + Express backend** that handles authentication, data persistence, and AI-powered processing. MongoDB is used for efficient storage of user data, sessions, and learning interactions.

Learna-AI enables learners to ask questions, receive intelligent explanations, and engage in guided learning conversations. By combining secure authentication, structured APIs, and AI services, the system ensures both **personalized learning** and **data security**.

Learna-AI demonstrates practical implementation of **AI-assisted education**, modern authentication workflows, and real-world full-stack application design.


---

## 🧠 Features

- 🤖 **AI-Driven Learning Assistance** – Uses AI to generate responses, explanations, or feedback.
- 🗣️ **Interactive Chat Interface** – Real-time interactive UI for engaging with the assistant.
- 🔐 **User Authentication** – JWT based sign-in/sign-up system.
- 📁 **Modular Architecture** – Clean separation of frontend and backend.
- 📦 **REST API** – Backend designed to serve AI endpoints and handle business logic.
- ⚙️ **Environment Configuration** – Secure configuration of sensitive keys and service endpoints.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js (JavaScript) |
| Backend | Node.js + Express |
| Database | MongoDB |
| Authentication | JSON Web Tokens (JWT) |
| AI Integration | Gemini-API |
| Deployment | Vercel / Render / Heroku / Custom |
| Containerization | Docker |

---

## 📁 Repository Structure
```bash
├── backend/ # API Server (Node.js + Express)
│ ├── controllers/ # Route handlers & business logic
│ ├── models/ # Database schemas (MongoDB)
│ ├── routes/ # API route definitions
│ ├── config/ 
│ ├── middleware/ # Auth, error handlers, etc.
│ ├── utils/ # Utility modules & helpers
│ └── server.js # Backend entry point
│
├── frontend/ai-learning-assistant/ # React frontend
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page views
| │ ├── utils/ 
│ | ├── context/
│ │ ├── services/ # API service wrappers
│ │ ├── App.jsx # Main app
│ │ └── main.jsx
│ ├── index.html/ 
│ └── package.json

```

---

## ⚙️ Environment Variables

Create a `.env` file in **backend** and configure the following:

```env
MONGO_URI=<Your MongoDB connection string>
PORT=<Server port, e.g., 5000>
JWT_SECRET=<Your JWT secret key>
NODE_ENV=development
MAX_FILE_SIZE=<Max upload size in bytes>
GOOGLE_API_KEY=<API key for Google services>
```
---

## 🚀 Installation & Setup

Follow the steps below to run **Learna-AI** locally.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/14anshuman/Learna-AI.git
cd Learna-AI
```
### 2️⃣ Backend Setup cd backend

```bash
cd backend
npm install

Start backend server
npm run dev
```
### 3️⃣ Frontend Setup (React)
```bash
cd ../frontend/ai-learning-assistant
npm install
npm start

Frontend will run at
http://localhost:5173

```
## ✅ Prerequisites
- Node.js (v16 or later)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Valid Google API Key


