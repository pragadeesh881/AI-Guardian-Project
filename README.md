# 🛡️ AI Guardian Angel

> A real-time AI-powered emergency response system with voice recognition, first-aid guidance, volunteer coordination, and MySQL database persistence.

![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## 🚀 Features

- 🎙️ **Voice Emergency Detection** — Speak your emergency and get instant JavaScript Web Speech API guidance
- 🩺 **First Aid Step-by-Step Guide** — Auto-generated instructions for 10+ emergency types
- 🗂️ **Emergency Cards** — Auto-generated cards with GPS coordinates and timestamps
- 👥 **Volunteer Dashboard** — Real-time volunteer request management (auto-refreshes every 30s)
- 🗄️ **MySQL Database** — All emergencies and cards persisted in real time via Node.js REST API
- 🔊 **Text-to-Speech** — Voice guidance for hands-free operation

---

## 🏗️ Architecture

```
[React (JavaScript/TSX) :5173] ──fetch()──► [Node.js Express API :3001] ──mysql2──► [MySQL: ai_guardian]
[Python Voice Server]                                                    ──mysql-connector──►  ↑
```

---

## 🧱 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | **JavaScript** (ES2020), TypeScript, React 18, Vite 5, Tailwind CSS, Lucide Icons |
| **API Server** | **Node.js**, **JavaScript** (CommonJS), Express 4, mysql2 |
| **Database** | MySQL 8 (3 tables: incidents, volunteers, emergency_cards) |
| **Browser APIs** | Web Speech API (`SpeechRecognition`), `SpeechSynthesis` (native JS) |
| **Python Server** | Python 3.13, SpeechRecognition, pyttsx3, playsound3 |
| **Dev Tools** | ESLint 9, PostCSS, Autoprefixer, TypeScript ESLint |

> 💡 **Note:** This project is primarily a **JavaScript** application. TypeScript is used as a typed superset — all code compiles to standard JavaScript (ES Modules) and runs natively in the browser and Node.js.

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js 18+
- Python 3.13+
- MySQL 8+

### 1. Database Setup
```bash
# Run the schema (creates ai_guardian database + tables + seed data)
mysql -u root < database/schema.sql
```

### 2. API Server (Node.js / JavaScript)
```bash
cd server-api
npm install
node index.js
# ✅ REST API running on http://localhost:3001
```

### 3. React Frontend (JavaScript / TypeScript)
```bash
cd client
npm install
npm run dev
# ✅ App running on http://localhost:5173
```

### 4. Python Voice Server (Optional)
```bash
cd server
pip install -r requirements.txt
python main.py
```

---

## 🌐 JavaScript API Endpoints

The Node.js Express server exposes these REST endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check + DB status |
| `GET` | `/api/incidents` | Fetch all emergency incidents |
| `POST` | `/api/incidents` | Create a new emergency incident |
| `GET` | `/api/volunteers` | Fetch all volunteer requests |
| `PATCH` | `/api/volunteers/:id` | Update volunteer request status |
| `GET` | `/api/emergency-cards` | Fetch all emergency cards |
| `POST` | `/api/emergency-cards` | Save an emergency card |

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `emergency_incidents` | All triggered emergencies (web JS + Python) |
| `volunteer_requests` | Volunteer response requests |
| `emergency_cards` | Generated emergency cards with GPS |

---

## 📁 Project Structure

```
AI Guardian/
├── client/                    # ⚡ JavaScript/React Frontend
│   └── src/
│       ├── components/        # EmergencyCard, VolunteerDashboard, etc.
│       ├── pages/             # HomePage
│       ├── hooks/             # useSpeechRecognition, useTextToSpeech (Web APIs)
│       ├── services/          # api.ts — JavaScript fetch() calls to MySQL API
│       ├── utils/             # emergencyUtils.ts
│       └── types/             # TypeScript interfaces
├── server-api/                # ⚡ Node.js JavaScript REST API
│   └── index.js               # Express server + MySQL connection pool
├── server/                    # 🐍 Python Voice Assistant
└── database/                  # 🗄️ MySQL Schema (SQL)
```

---

## 🙏 Author

**Pragadeesh** — Built with ❤️ using JavaScript, Node.js, React, and MySQL for emergency response and community safety.
