# 🛡️ AI Guardian Angel

> A real-time AI-powered emergency response system with voice recognition, first-aid guidance, volunteer coordination, and MySQL database persistence.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Python](https://img.shields.io/badge/Python-3.13-yellow?logo=python) ![MySQL](https://img.shields.io/badge/MySQL-8-orange?logo=mysql) ![Express](https://img.shields.io/badge/Express-4-green?logo=express)

---

## 🚀 Features

- 🎙️ **Voice Emergency Detection** — Speak your emergency and get instant guidance
- 🩺 **First Aid Step-by-Step Guide** — Auto-generated instructions for 10+ emergency types
- 🗂️ **Emergency Cards** — Auto-generated cards with GPS coordinates and timestamps
- 👥 **Volunteer Dashboard** — Real-time volunteer request management
- 🗄️ **MySQL Database** — All emergencies and cards persisted in real time
- 🔊 **Text-to-Speech** — Voice guidance for hands-free operation

---

## 🏗️ Architecture

```
[React Client :5173] ──fetch()──► [Express API :3001] ──mysql2──► [MySQL: ai_guardian]
[Python Voice Server]                                  ──mysql-connector──►  ↑
```

---

## 🧱 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| API Server | Node.js, Express, mysql2 |
| Database | MySQL 8 (3 tables: incidents, volunteers, emergency_cards) |
| Python Server | Python 3.13, SpeechRecognition, pyttsx3, playsound3 |
| Dev Tools | ESLint, PostCSS, Autoprefixer |

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js 18+
- Python 3.13+
- MySQL 8+

### 1. Database Setup
```bash
# Run the schema (creates ai_guardian database + tables)
mysql -u root < database/schema.sql
```

### 2. API Server
```bash
cd server-api
npm install
node index.js
# ✅ Runs on http://localhost:3001
```

### 3. React Frontend
```bash
cd client
npm install
npm run dev
# ✅ Runs on http://localhost:5173
```

### 4. Python Voice Server (Optional)
```bash
cd server
pip install -r requirements.txt
python main.py
```

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `emergency_incidents` | All triggered emergencies (web + voice) |
| `volunteer_requests` | Volunteer response requests |
| `emergency_cards` | Generated emergency cards with GPS |

---

## 📁 Project Structure

```
AI Guardian/
├── client/          # React + TypeScript frontend
│   └── src/
│       ├── components/    # EmergencyCard, VolunteerDashboard, etc.
│       ├── pages/         # HomePage
│       ├── hooks/         # useSpeechRecognition, useTextToSpeech
│       ├── services/      # api.ts (MySQL API layer)
│       └── utils/         # emergencyUtils.ts
├── server-api/      # Node.js Express REST API (MySQL bridge)
├── server/          # Python voice assistant
└── database/        # MySQL schema
```

---

## 🙏 Author

**Pragadeesh** — Built with ❤️ for emergency response and community safety.
