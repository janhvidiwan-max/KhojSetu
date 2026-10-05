# ReturnHome — Intelligent Missing Person Detection & Reconnection System

**Tagline**: *"Reconnecting Loved Ones • From Missing to Found."*

**ReturnHome** is an AI-assisted, human-in-the-loop investigation platform designed for authorized law enforcement agencies, investigators, missing-person relief organizations, and public citizens.

ReturnHome compares registered missing-person profiles against faces detected in CCTV feeds, video uploads, and image sets. Rather than performing autonomous public alerting or automated status changes, ReturnHome surfaces **candidate matches** with explicit similarity scores for mandatory investigator verification.

---

## 🌟 Core Features

- **Role-Based Authentication & Google OAuth**: Dedicated sign-in portals for Law Enforcement Admins, Field Investigators, and Public Citizen Reporters with Google Login integration.
- **Strict Role Data Isolation**: Public citizens can only access their own submitted cases. Investigators require explicit case assignment or approved permission from an Admin to investigate restricted cases.
- **512-D Facial Vector Matching**: High-dimensional vector embeddings for fast mathematical face similarity calculation.
- **Automated CCTV Frame Quality Assessment**: Evaluates Laplacian blur score, lighting quality, and pose angle for every facial crop.
- **Interactive Esri Satellite Map Telemetry**: High-resolution GIS satellite map tracking last-known sighting coordinates.
- **Public Citizens Report Portal**: Encrypted citizen submission channel with reference tracking codes (`PUB-REF-9021`).
- **Official Dossier Export**: Generate printable/PDF case reports featuring ReturnHome logos, branding, and ethical AI disclaimers.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Leaflet Maps
- **Backend**: Node.js, Express.js, Socket.IO, JWT Authentication, Mongoose / MongoDB
- **AI Service**: Python 3.10+, FastAPI, PyTorch / OpenCV Computer Vision
- **Deployment**: Vercel Production (`https://khojsetu.vercel.app` / ReturnHome), Docker

---

## 🚀 Quick Start

### 1. Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Service
```bash
cd backend
npm install
npm run dev
```

### 3. AI FastAPI Microservice
```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

---

## 📄 License
MIT License © 2026 ReturnHome Engineering Team.
