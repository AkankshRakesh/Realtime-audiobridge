import React, { useEffect, useRef, useState } from "react";

const Transcriber = () => {
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
  const streamAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      console.log("⏹️ Stopped, preparing blob...");
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      audioChunksRef.current = [];

      const formData = new FormData();
      formData.append("file", blob, "recording.webm");

      try {
        const res = await fetch("http://localhost:8000/transcribe", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log("📄 Got:", data);
        if (data.transcript) setTranscript(prev => prev + " " + data.transcript);
        if (data.translation) setTranslation(prev => prev + " " + data.translation);
      } catch (err) {
        console.error("❌ Error sending blob:", err);
      }

      // 🔁 Restart recording AFTER response is handled
      setTimeout(() => {
        console.log("▶️ Restarting recording...");
        mediaRecorder.start();
        setTimeout(() => {
          console.log("⏹️ Stopping again...");
          mediaRecorder.stop();
        }, 5000);
      }, 500); // short delay to prevent stack overflow / race
    };

    // 🔄 Initial start
    console.log("🎙️ Recording started");
    mediaRecorder.start();

    // Stop after 5 seconds to start the cycle
    setTimeout(() => {
      console.log("⏹️ Stopping first time...");
      mediaRecorder.stop();
    }, 5000);
  };

  streamAudio();

  return () => {
    mediaRecorderRef.current?.stop();
  };
}, []);


  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-extrabold text-center text-gray-800">
          🎙️ Live Speech Transcriber
        </h1>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Live Transcript (English)
          </h2>
          <div className="bg-gray-100 text-gray-800 p-4 rounded-lg h-40 overflow-y-auto font-mono whitespace-pre-wrap">
            {transcript || "Listening..."}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Hindi Translation
          </h2>
          <div className="bg-yellow-100 text-gray-900 p-4 rounded-lg h-40 overflow-y-auto font-mono whitespace-pre-wrap">
            {translation || "Hindi translation here..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcriber;
