import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc, increment } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import {
  FaArrowLeft,
  FaBullseye,
  FaCheck,
  FaClock,
  FaMicrophone,
} from "react-icons/fa";
const DAILY_TOPICS = [
  "Describe your dream career.",
  "Talk about your favorite movie.",
  "Describe your best friend.",
  "What would you do if you won ₹10 lakh?",
  "Describe your ideal vacation.",
  "Talk about a skill you want to learn.",
  "Describe your biggest achievement.",
  "Talk about your favorite food.",
  "Describe your perfect day.",
  "Talk about a person who inspires you.",
  "Describe your favorite place.",
  "What is your biggest goal in life?",
  "Talk about your favorite hobby.",
  "Describe your dream house.",
  "Talk about your favorite childhood memory.",
  "What makes you happy?",
  "Describe a country you want to visit.",
  "Talk about your favorite book.",
  "What would you change about your school or college?",
  "Describe your ideal job.",
  "Talk about a difficult situation you overcame.",
  "What is one thing you cannot live without?",
  "Describe your morning routine.",
  "Talk about your favorite festival.",
  "What does success mean to you?",
  "Describe your favorite season.",
  "Talk about something you are proud of.",
  "If you could meet anyone, who would it be?",
  "Describe your plans for the next five years.",
  "What advice would you give to your younger self?",
];

function getDailyTopic() {
  const today = new Date();

  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (today - startOfYear) / (1000 * 60 * 60 * 24)
  );

  return DAILY_TOPICS[(dayOfYear - 1) % DAILY_TOPICS.length];
}

export default function DailyChallenge() {
  const dailyTopic = getDailyTopic();
  // =====================================
  // STATES
  // =====================================

  const [seconds, setSeconds] = useState(60);
  const [isStarted, setIsStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [transcript, setTranscript] = useState("");

  const [isListening, setIsListening] = useState(false);

  const [score, setScore] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);

  // =====================================
  // SPEECH RECOGNITION REFS
  // =====================================

  const recognitionRef = useRef(null);

  // Keeps track of whether challenge is running
  const isStartedRef = useRef(false);

  // Stores finalized speech
  const finalTranscriptRef = useRef("");

  // Prevents multiple recognition sessions
  const recognitionRunningRef = useRef(false);

  // Stores pending restart timer
  const restartTimerRef = useRef(null);

  // =====================================
  // SAFE STOP RECOGNITION
  // =====================================

  const stopRecognition = () => {
    // Clear pending restart
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    // Stop recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        console.log("Speech recognition already stopped.");
      }
    }

    recognitionRunningRef.current = false;
    setIsListening(false);
  };

  // =====================================
  // START RECOGNITION
  // =====================================

  const startRecognition = () => {
    if (!recognitionRef.current) {
      console.log("❌ Recognition object not available");
      return;
    }

    if (!isStartedRef.current) {
      console.log("🛑 Challenge is not active");
      return;
    }

    if (recognitionRunningRef.current) {
      console.log("🎤 Recognition is already running");
      return;
    }

    try {
      console.log("🎤 Starting speech recognition...");

      recognitionRunningRef.current = true;

      recognitionRef.current.start();
    } catch (error) {
      console.log(
        "⚠️ Could not start recognition:",
        error
      );

      recognitionRunningRef.current = false;

      if (isStartedRef.current) {
        restartTimerRef.current = setTimeout(() => {
          restartTimerRef.current = null;

          if (isStartedRef.current) {
            startRecognition();
          }
        }, 1000);
      }
    }
  };

  // =====================================
  // CALCULATE SPEAKING SCORE
  // =====================================

  const calculateSpeakingScore = (remainingSeconds = seconds) => {
    const text = finalTranscriptRef.current.trim();

    // No speech
    if (!text) {
      return {
        score: 0,
        wordCount: 0,
        wordsPerMinute: 0,
      };
    }

    // -------------------------------------
    // COUNT WORDS
    // -------------------------------------

    const words = text
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const wordCount = words.length;

    // -------------------------------------
    // CALCULATE ELAPSED TIME
    // -------------------------------------

    const elapsedSeconds = Math.max(
      0,
      60 - remainingSeconds
    );

    const minutes = elapsedSeconds / 60;

    const wordsPerMinute =
      minutes > 0
        ? Math.round(wordCount / minutes)
        : 0;

    // =====================================
    // 1. FLUENCY SCORE - 40 POINTS
    // =====================================

    let fluencyScore;

    if (wordCount >= 80) {
      fluencyScore = 40;
    } else if (wordCount >= 60) {
      fluencyScore = 35;
    } else if (wordCount >= 40) {
      fluencyScore = 30;
    } else if (wordCount >= 20) {
      fluencyScore = 20;
    } else {
      fluencyScore = 10;
    }

    // =====================================
    // 2. SPEAKING SPEED - 30 POINTS
    // =====================================
let speedScore;

    if (
      wordsPerMinute >= 90 &&
      wordsPerMinute <= 150
    ) {
      speedScore = 30;
    } else if (
      wordsPerMinute >= 70 &&
      wordsPerMinute <= 170
    ) {
      speedScore = 25;
    } else if (
      wordsPerMinute >= 50 &&
      wordsPerMinute <= 190
    ) {
      speedScore = 20;
    } else {
      speedScore = 10;
    }

    // =====================================
    // 3. COMPLETION - 30 POINTS
    // =====================================

    let completionScore;

    if (elapsedSeconds >= 55) {
      completionScore = 30;
    } else if (elapsedSeconds >= 45) {
      completionScore = 25;
    } else if (elapsedSeconds >= 30) {
      completionScore = 20;
    } else {
      completionScore = 10;
    }

    // =====================================
    // FINAL SCORE
    // =====================================

    const finalScore =
      fluencyScore +
      speedScore +
      completionScore;

    return {
      score: Math.min(100, finalScore),
      wordCount,
      wordsPerMinute,
    };
  };

  // =====================================
  // COMPLETE CHALLENGE
  // =====================================

  const completeChallenge = async (remainingTime = seconds) => {
    console.log("✅ Completing Daily Challenge");

    // Prevent speech recognition from restarting
    isStartedRef.current = false;

    // Calculate result BEFORE changing state
    const result =
      calculateSpeakingScore(remainingTime);

    console.log("📊 Speaking Result:", result);
    // Save Daily Challenge result to Firebase
if (auth.currentUser) {
  const userRef = doc(db, "users", auth.currentUser.uid);

  await setDoc(
    userRef,
    {
      fluencyScore: result.score,
      lessonsCompleted: increment(1),
      lastChallengeDate: new Date(),
      lastChallengeWords: result.wordCount,
      lastChallengeWPM: result.wordsPerMinute,
    },
    { merge: true }
  );

  console.log("🔥 Daily Challenge saved to Firebase");
}

    // Save result
    setScore(result.score);
    setWordCount(result.wordCount);
    setWordsPerMinute(result.wordsPerMinute);

    // Stop everything
    stopRecognition();

    setIsStarted(false);
    setCompleted(true);
  };

  // =====================================
  // SPEECH RECOGNITION SETUP
  // =====================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error(
        "Speech Recognition is not supported in this browser."
      );

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // =====================================
    // RECOGNITION START
    // =====================================

    recognition.onstart = () => {
      console.log("🎤 Speech recognition started");

      recognitionRunningRef.current = true;

      setIsListening(true);
    };

    // =====================================
    // RECOGNITION RESULT
    // =====================================

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const text =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current +=
            text + " ";
        } else {
          interimTranscript += text;
        }
      }

      const displayText = (
        finalTranscriptRef.current +
        interimTranscript
      ).trim();

      console.log("🗣️ Speech:", displayText);

      setTranscript(displayText);
    };

    // =====================================
    // RECOGNITION END
    // =====================================

    recognition.onend = () => {
      console.log(
        "⚠️ Speech recognition ended"
      );

      recognitionRunningRef.current = false;

      setIsListening(false);

      // Only restart if challenge is still active
      if (isStartedRef.current) {
        console.log(
          "🔄 Restarting speech recognition..."
        );

        restartTimerRef.current = setTimeout(() => {
          restartTimerRef.current = null;

          if (!isStartedRef.current) {
            return;
          }

          startRecognition();
        }, 300);
      }
    };

    // =====================================
    // RECOGNITION ERROR
    // =====================================

    recognition.onerror = (event) => {
      console.error(
        "❌ Speech recognition error:",
        event.error
      );

      recognitionRunningRef.current = false;

      if (
        event.error === "no-speech" ||
        event.error === "aborted"
      ) {
        return;
      }

      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // =====================================
    // CLEANUP
    // =====================================

    return () => {
      isStartedRef.current = false;

      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }

      try {
        recognition.stop();
      } catch (error) {
        console.log(
          "Recognition cleanup:",
          error.message
        );
      }

      recognitionRef.current = null;
    };
  }, []);

  // =====================================
  // TIMER
  // =====================================

  useEffect(() => {
    if (
      !isStarted ||
      completed ||
      seconds <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        // =====================================
        // TIME IS UP
        // =====================================

        if (prev <= 1) {
          clearInterval(timer);

          console.log(
            "⏰ Time is up. Completing challenge..."
          );

          // IMPORTANT:
          // We pass 0 directly so the score
          // calculation knows the challenge
          // lasted the full 60 seconds.
          completeChallenge(0);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isStarted, completed]);

  // =====================================
  // START CHALLENGE
  // =====================================

  const startChallenge = () => {
    console.log(
      "▶️ Starting Daily Challenge"
    );

    // Clear old restart timer
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    // Mark challenge as active
    isStartedRef.current = true;

    recognitionRunningRef.current = false;

    // Reset states
    setIsStarted(true);
    setCompleted(false);

    setSeconds(60);

    setTranscript("");

    setScore(0);
    setWordCount(0);
    setWordsPerMinute(0);

    // Clear old speech
    finalTranscriptRef.current = "";

    // Start microphone
    startRecognition();
  };

  // =====================================
  // RESET CHALLENGE
  // =====================================

  const resetChallenge = () => {
    console.log(
      "🔄 Resetting Daily Challenge"
    );

    // Prevent recognition restart
    isStartedRef.current = false;

    // Stop recognition
    stopRecognition();

    // Reset states
    setSeconds(60);

    setIsStarted(false);

    setCompleted(false);

    setTranscript("");

    setScore(0);

    setWordCount(0);

    setWordsPerMinute(0);

    // Clear speech
    finalTranscriptRef.current = "";

    setIsListening(false);
  };

  // =====================================
  // FORMATTED TIMER
  // =====================================

  const formattedTime = `00:${String(
    seconds
  ).padStart(2, "0")}`;

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-h-screen bg-[#f6f0ff]">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="border-b border-violet-100 bg-white shadow-sm">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div className="flex items-center gap-5">

            <Link
              to="/dashboard"
              className="rounded-xl bg-violet-100 p-3 text-violet-700 transition hover:bg-violet-200"
            >
              <FaArrowLeft />
            </Link>

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                Daily Challenge
              </h1>

              <p className="text-slate-500">
                Complete today's English speaking challenge.
              </p>

            </div>

          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-xl text-white">

            <FaBullseye />

          </div>

        </div>

      </header>

      {/* ================================= */}
      {/* MAIN */}
      {/* ================================= */}

      <main className="mx-auto max-w-5xl px-8 py-10">

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}

        <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-500 p-8 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl">
              🎯
            </div>

            <div>

              <p className="font-semibold text-violet-100">
                TODAY'S CHALLENGE
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Speak for 60 Seconds
              </h2>

            </div>

          </div>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-violet-100">
            Speak continuously in English for one minute.
            Don't worry about making mistakes. Focus on
            expressing your thoughts clearly and confidently.
          </p>

        </div>

        {/* ================================= */}
        {/* CHALLENGE CARD */}
        {/* ================================= */}

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-lg">

          {/* TOPIC HEADER */}

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700">
              <FaMicrophone />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Your Speaking Topic
              </h2>

              <p className="text-slate-500">
                Talk about the topic below.
              </p>

            </div>

          </div>

          {/* TOPIC */}

          <div className="mt-8 rounded-2xl bg-violet-50 p-6">

            <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
              Topic
            </p>

            <h3 className="mt-3 text-3xl font-bold text-slate-900">
             "{dailyTopic}"
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Talk about what career you would like to have,
              why you are interested in it, and what skills
              you need to achieve your goal.
            </p>

          </div>

          {/* ================================= */}
          {/* TIMER */}
          {/* ================================= */}

          <div className="mt-8 flex flex-col items-center rounded-3xl border border-violet-100 bg-white p-8">

            <div className="flex items-center gap-3 text-slate-500">

              <FaClock />

              <span className="font-medium">
                Challenge Time
              </span>

            </div>

            <h3 className="mt-4 text-6xl font-bold text-violet-700">
              {formattedTime}
            </h3>

            {seconds === 0 && !completed && (
              <p className="mt-3 font-semibold text-orange-500">
                Time's up! 🎉
              </p>
            )}

          </div>

          {/* ================================= */}
          {/* SPEECH TRANSCRIPT */}
          {/* ================================= */}

          <div className="mt-8 rounded-3xl bg-slate-50 p-6">

            <div className="flex items-center justify-between">

              <h3 className="text-xl font-bold text-slate-900">
                🎤 Your Speech
              </h3>

              {isListening && (
                <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600">
                  🔴 Listening...
                </span>
              )}

            </div>

            <div className="mt-4 min-h-[150px] rounded-2xl bg-white p-5 text-slate-700 shadow-sm">

              {transcript ? (
                transcript
              ) : (
                <span className="text-slate-400">
                  Your speech will appear here when you start
                  speaking...
                </span>
              )}

            </div>

          </div>

          {/* ================================= */}
          {/* COMPLETED RESULT */}
          {/* ================================= */}

          {completed && (
            <div className="mt-8 rounded-3xl bg-green-50 p-6 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
                <FaCheck />
              </div>

              <h3 className="mt-4 text-2xl font-bold text-green-700">
                Challenge Completed! 🎉
              </h3>

              <p className="mt-2 text-green-600">
                Great job! Keep practicing every day.
              </p>

              {/* SCORE CARDS */}

              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                {/* SCORE */}

                <div className="rounded-2xl bg-white p-5 shadow-sm">

                  <p className="text-sm font-medium text-slate-500">
                    Speaking Score
                  </p>

                  <p className="mt-2 text-4xl font-bold text-violet-700">
                    {score}/100
                  </p>

                </div>

                {/* WORD COUNT */}

                <div className="rounded-2xl bg-white p-5 shadow-sm">

                  <p className="text-sm font-medium text-slate-500">
                    Words Spoken
                  </p>

                  <p className="mt-2 text-4xl font-bold text-violet-700">
                    {wordCount}
                  </p>

                </div>

                {/* WPM */}

                <div className="rounded-2xl bg-white p-5 shadow-sm">

                  <p className="text-sm font-medium text-slate-500">
                    Speaking Speed
                  </p>

                  <p className="mt-2 text-4xl font-bold text-violet-700">
                    {wordsPerMinute} WPM
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ================================= */}
          {/* BUTTONS */}
          {/* ================================= */}

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            {/* START */}

            {!isStarted && !completed && (
              <button
                onClick={startChallenge}
                className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 font-semibold text-white transition hover:scale-105"
              >

                <FaMicrophone />

                Start Challenge

              </button>
            )}

            {/* COMPLETE MANUALLY */}

            {isStarted && (
              <button
                onClick={() => completeChallenge(seconds)}
                className="flex items-center justify-center gap-3 rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-green-700"
              >

                <FaCheck />

                Complete Challenge

              </button>
            )}

            {/* TRY AGAIN */}

            {completed && (
              <button
                onClick={resetChallenge}
                className="rounded-2xl border border-violet-300 px-8 py-4 font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Try Again
              </button>
            )}

          </div>

        </div>

        {/* ================================= */}
        {/* SPEAKING TIPS */}
        {/* ================================= */}

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-lg">

          <h2 className="text-2xl font-bold text-slate-900">
            💡 Speaking Tips
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {/* TIP 1 */}

            <div className="rounded-2xl bg-violet-50 p-5">

              <h3 className="font-bold text-violet-700">
                Speak Naturally
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Don't try to memorize sentences. Speak
                naturally and express your own thoughts.
              </p>

            </div>

            {/* TIP 2 */}

            <div className="rounded-2xl bg-violet-50 p-5">

              <h3 className="font-bold text-violet-700">
                Don't Fear Mistakes
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Mistakes are part of learning. Focus on
                communicating your ideas.
              </p>

            </div>

            {/* TIP 3 */}

            <div className="rounded-2xl bg-violet-50 p-5">

              <h3 className="font-bold text-violet-700">
                Keep Going
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                If you forget a word, explain it another way
                and keep speaking.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}