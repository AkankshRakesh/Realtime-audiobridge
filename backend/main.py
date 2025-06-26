from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from faster_whisper import WhisperModel
import argostranslate.package, argostranslate.translate
from pathlib import Path
import subprocess
import traceback
import os
import uuid

# Load Whisper model
model = WhisperModel("tiny", compute_type="int8")

# Load Argos Translate model
argos_model_path = Path("translate-en_hi.argosmodel")
if argos_model_path.exists():
    argostranslate.package.install_from_path(str(argos_model_path))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    uid = str(uuid.uuid4())
    webm_path = f"temp_{uid}.webm"
    wav_path = f"temp_{uid}.wav"

    try:
        print(f"🎧 Received file: {file.filename}")

        # Save uploaded file
        with open(webm_path, "wb") as f:
            f.write(await file.read())

        print(f"🔄 Converting {webm_path} to {wav_path}...")

        # FFmpeg with error output captured
        result = subprocess.run([
            "ffmpeg", "-y", "-i", webm_path, "-ar", "16000", "-ac", "1", wav_path
        ], capture_output=True, text=True)

        if result.returncode != 0:
            print("❌ FFmpeg stderr:", result.stderr)
            print("❌ FFmpeg stdout:", result.stdout)
            raise RuntimeError("Audio conversion failed")

        print("✅ WAV conversion successful")

        # Transcribe with Whisper
        segments, _ = model.transcribe(wav_path)
        text = " ".join([s.text for s in segments])
        print("📝 Transcribed text:", text)

        # Translate with Argos
        translated = argostranslate.translate.translate(text, "en", "hi")
        print("🌐 Translated text:", translated)

        return {"transcript": text, "translation": translated}

    except Exception as e:
        print("❌ Transcription error:", e)
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)

    finally:
        # Always clean up temp files
        for path in [webm_path, wav_path]:
            try:
                if os.path.exists(path):
                    os.remove(path)
                    print(f"🧹 Deleted {path}")
            except Exception as cleanup_err:
                print(f"⚠️ Failed to delete {path}:", cleanup_err)
