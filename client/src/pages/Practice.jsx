import { askGemini } from "../services/gemini";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaMicrophone,
  FaRobot,
  FaPlay,
  FaStop,
} from "react-icons/fa";

export default function Practice() {
  // ===============================
// STATES
// ===============================

const [isListening, setIsListening] = useState(false);

const [transcript, setTranscript] = useState("");
const [aiReply, setAiReply] = useState("");

const [seconds, setSeconds] = useState(0);

const recognitionRef = useRef(null);

// ===============================
// SPEECH RECOGNITION
// ===============================

useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let text = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {
      text += event.results[i][0].transcript;
    }

    setTranscript(text);
  };

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.log(event.error);
  };

  recognitionRef.current = recognition;
}, []);
// ===============================
// TIMER
// ===============================

useEffect(() => {
  let interval;

  if (isListening) {
    interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }

  return () => clearInterval(interval);
}, [isListening]);
// ===============================
// FUNCTIONS
// ===============================

const startListening = () => {
  if (!recognitionRef.current) return;

  setTranscript("");
  setSeconds(0);

  recognitionRef.current.start();
};

const stopListening = async () => {
  if (!recognitionRef.current) return;

  recognitionRef.current.stop();

  if (!transcript.trim()) return;

  setAiReply("Thinking...");

  const reply = await askGemini(transcript);

  setAiReply(reply);

  // 🔊 AI speaks the response
  const speech = new SpeechSynthesisUtterance(reply);

  speech.lang = "en-US";
  speech.rate = 0.95;
  speech.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
};
  return (
    <div className="min-h-screen bg-[#f6f0ff]">

      {/* Header */}

      <header className="bg-white border-b border-violet-100 shadow-sm">

        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

          <div className="flex items-center gap-5">

            <Link
              to="/dashboard"
              className="p-3 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 transition"
            >
              <FaArrowLeft />
            </Link>

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                AI Speaking Coach
              </h1>

              <p className="text-slate-500">
                Practice real conversations with AI
              </p>

            </div>

          </div>

          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-xl">

            <FaRobot />

          </div>

        </div>

      </header>

      {/* Main */}

      <main className="max-w-7xl mx-auto px-8 py-10">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}

          <div className="lg:col-span-2">

            <div className="rounded-3xl bg-white shadow-lg p-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Conversation
              </h2>

              <p className="text-slate-500 mt-2">
                Talk naturally with your AI tutor.
              </p>

              {/* Chat */}

              <div className="mt-8 space-y-6 h-[500px] overflow-y-auto">

                {/* AI */}

                <div className="flex">

                  <div className="max-w-lg rounded-3xl rounded-tl-md bg-violet-100 p-5">

                    <p className="font-bold text-violet-700">
                      🤖 AI Coach
                    </p>

                    <p className="mt-2 text-slate-700">
                      Hello 👋

                      Tell me about yourself in English.
                    </p>

                  </div>

                </div>

                {/* User */}

                <div className="flex justify-end">

                  <div className="max-w-lg rounded-3xl rounded-tr-md bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white p-5">

                    <p className="font-bold">
                      👤 You
                    </p>

                   <p className="mt-2">
  {transcript
    ? transcript
    : "Your speech will appear here..."}
</p>

                  </div>

                </div>

                {/* AI */}

                <div className="flex">

                  <div className="max-w-lg rounded-3xl rounded-tl-md bg-violet-100 p-5">

                    <p className="font-bold text-violet-700">
                      🤖 AI Feedback
                    </p>

                    <p className="mt-2 text-slate-700">
  {aiReply || "Your AI feedback will appear here..."}
</p>

                  </div>

                </div>

              </div>

              {/* Buttons */}

              <div className="mt-10 flex gap-5">

                <button
  onClick={startListening}
  className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition"
>
  <FaPlay />

  {isListening ? "Listening..." : "Start Practice"}
</button>

              <button
  onClick={stopListening}
  className="flex items-center gap-3 border border-red-300 text-red-600 px-8 py-4 rounded-2xl font-semibold hover:bg-red-50 transition"
>
  <FaStop />

  End Session
</button>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div>

            <div className="rounded-3xl bg-white shadow-lg p-8 sticky top-8">

              <div className="flex items-center gap-3">

                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 flex items-center justify-center text-white">

                  <FaMicrophone />

                </div>

                <div>

                  <h2 className="text-2xl font-bold">
                    AI Analysis
                  </h2>

                  <p className="text-slate-500">
                    Live speaking feedback
                  </p>

                </div>

              </div>

              <div className="mt-8 space-y-5">

                <div className="rounded-2xl bg-violet-50 p-5">

                  <p className="text-slate-500">
                    Status
                  </p>

                 <h3
  className={`mt-2 text-2xl font-bold ${
    isListening
      ? "text-red-600"
      : "text-violet-700"
  }`}
>
  {isListening ? "🎤 Listening..." : "Ready"}
</h3>

                </div>

                <div className="rounded-2xl bg-violet-50 p-5">

                  <p className="text-slate-500">
                    Duration
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {`${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
  seconds % 60
).padStart(2, "0")}`}
                  </h3>

                </div>

                <div className="rounded-2xl bg-violet-50 p-5">

                  <p className="text-slate-500">
                    AI Status
                  </p>

                 <h3 className="mt-2 text-2xl font-bold text-green-600">
  {aiReply === "Thinking..."
    ? "Thinking..."
    : aiReply
    ? "Responded"
    : "Waiting..."}
</h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}