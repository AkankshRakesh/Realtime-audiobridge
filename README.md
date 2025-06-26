# 🎙️ Real-Time Speech Transcriber & Translator

![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![React](https://img.shields.io/badge/Frontend-React-blue)

A browser-based application that captures microphone input, transcribes speech using Whisper AI, and translates English to Hindi in real-time. Fully containerized with Docker for easy deployment.

## 🌟 Features

- 🎤 **Live microphone recording** via browser
- ✍️ **Accurate transcription** using Whisper (tiny model)
- 🌍 **English → Hindi translation** via Argos Translate
- ⚡ **5-second processing cycles** for near real-time results
- 🐳 **Full Docker integration** (frontend + backend)
- 🚀 **Modern stack** (React, FastAPI, Tailwind CSS)

## 📦 Prerequisites

- Docker & Docker Compose
- Git (optional: Git LFS for large model files)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/AkankshRakesh/realtime-transcriber.git
cd realtime-transcriber
```
### 2. Download Translation Model
Download the English-Hindi model from [Argos Open Tech](https://www.argosopentech.com/argospm/index/) and place it in the backend folder:
```bash
mv translate-en_hi-1_1.argosmodel backend/translate-en_hi.argosmodel
```
Note: If the model exceeds 100MB, consider using Git LFS.

## Running the application
```bash
docker-compose up --build
```
Access the application:
Frontend: http://localhost:5173
Backend API: http://localhost:8000

## 📚 API Documentation
### Upload webm audio for transcription and translation.

```http
  POST /transcribe
```

| Content-Type | File     | Response                |
| :-------- | :------- | :------------------------- |
| `multipart/form-data` | `recording.webm` | `transcript, translation` |

🏗️ Project Structure
```bash
.
├── backend/
│   ├── main.py                # FastAPI application
│   ├── Dockerfile             # Backend container config
│   ├── requirements.txt       # Python dependencies
│   └── translate-en_hi.argosmodel  # Translation model
├── frontend/
│   ├── src/components/        # React UI components
│   ├── Dockerfile             # Frontend container config
│   ├── package.json
│   └── tailwind.config.js     # Tailwind CSS config
└── docker-compose.yml         # Multi-container orchestration
```
![Architecture Diagram](https://github.com/AkankshRakesh/Realtime-audiobridge/blob/master/Architecture.png?raw=true)
## Tech Stack

**Frontend:** React, Tailwind CSS, Vite

**Backend:** FastAPI, Python

**Transcription:** faster-whisper

**Translation:** Argos Translate

**Audio Processing:** FFmpeg

**Containerization:** Docker, Docker Compose
