import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaBookOpen,
  FaMicrophone,
  FaArrowRight,
  FaRandom,
 FaBullseye,
FaTrophy,
FaMedal,
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
  streak: 0,
  fluencyScore: 0,
  lessonsCompleted: 0,
  vocabulary: 0,
  practiceSessions: 0,
  practiceMinutes: 0,
});
  const weeklyGoal = 7;

const progressPercentage = Math.min(
  Math.round((userData.lessonsCompleted / weeklyGoal) * 100),
  100
);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const stats = [
    {
      title: "Current Streak",
      value: `🔥 ${userData.streak}`,
      subtitle: "Days",
    },
    {
      title: "Fluency Score",
      value: `${userData.fluencyScore}%`,
      subtitle: "Excellent",
    },
    {
      title: "Lessons Completed",
      value: userData.lessonsCompleted,
      subtitle: "Lessons",
    },
    {
      title: "Vocabulary",
      value: userData.vocabulary,
      subtitle: "Words",
    },
    {
  title: "Practice Sessions",
  value: userData.practiceSessions,
  subtitle: "AI Sessions",
},
{
  title: "Practice Time",
  value: `${userData.practiceMinutes} min`,
  subtitle: "Total Time",
},
  ];

  return (
    <div className="min-h-screen bg-[#f6f0ff]">
      {/* Header */}
      <header className="border-b border-purple-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <h1 className="text-3xl font-bold text-slate-900">
            SpeakSphere
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
              S
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-10">
        <h2 className="text-4xl font-bold text-slate-900">
          Welcome Back 👋
        </h2>

        <p className="mt-2 text-lg text-slate-600">
          Continue improving your English today.
        </p>

        {/* Stats */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <p className="text-slate-500">{stat.title}</p>

              <h3 className="mt-4 text-4xl font-bold text-violet-600">
                {stat.value}
              </h3>

              <p className="mt-2 text-slate-500">
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Dashboard Content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* AI Coach */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-2xl text-white">
                <FaMicrophone />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  AI Speaking Coach
                </h3>

                <p className="text-slate-500">
                  Practice English with instant AI feedback.
                </p>
              </div>
            </div>

            <p className="mt-8 leading-8 text-slate-600">
              Start a conversation with your AI tutor to improve your
              pronunciation, grammar and fluency.
            </p>

            <button
  onClick={() => navigate("/practice")}
  className="mt-8 flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 font-semibold text-white transition hover:scale-105"
>
              Start Practice
              <FaArrowRight />
            </button>
          </div>

          {/* Weekly Progress */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900">
              Weekly Progress
            </h3>

            <p className="mt-2 text-slate-500">
              You've completed {progressPercentage}% of your learning goal.
            </p>

            <div className="mt-8">
              <div className="mb-3 flex justify-between text-sm font-medium">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>

              <div className="h-4 rounded-full bg-slate-200">
               <div
  className="h-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
  style={{ width: `${progressPercentage}%` }}
></div>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex justify-between">
                <span className="text-slate-600">Lessons This Week</span>
                <span className="font-bold">
                  {userData.lessonsCompleted}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Current Streak</span>
                <span className="font-bold">
                  {userData.streak} Days
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Vocabulary Learned</span>
                <span className="font-bold">
                  {userData.vocabulary} Words
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Activity */}
<div className="mt-12 rounded-3xl bg-white p-8 shadow-lg">
  <h2 className="text-3xl font-bold text-slate-900">
    Recent Activity
  </h2>

  <p className="mt-2 text-slate-500">
    Keep track of your English learning journey.
  </p>

  <div className="mt-8 space-y-4">

    {/* AI Practice */}
    <div className="flex items-center justify-between rounded-2xl bg-violet-50 p-5">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-violet-100 p-3 text-xl text-violet-700">
          🎤
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            AI Speaking Practice
          </h3>
          <p className="text-sm text-slate-500">
            {userData.practiceSessions} sessions completed
          </p>
        </div>
      </div>

      <span className="font-bold text-violet-600">
        {userData.practiceMinutes} min
      </span>
    </div>

    {/* Vocabulary */}
    <div className="flex items-center justify-between rounded-2xl bg-violet-50 p-5">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-violet-100 p-3 text-xl text-violet-700">
          📚
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            Vocabulary Learning
          </h3>
          <p className="text-sm text-slate-500">
            Words learned
          </p>
        </div>
      </div>

      <span className="font-bold text-violet-600">
        {userData.vocabulary}
      </span>
    </div>

    {/* Daily Challenge */}
    <div className="flex items-center justify-between rounded-2xl bg-violet-50 p-5">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-violet-100 p-3 text-xl text-violet-700">
          🎯
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            Daily Challenge
          </h3>
          <p className="text-sm text-slate-500">
            Keep your speaking streak going
          </p>
        </div>
      </div>

      <span className="font-bold text-violet-600">
        🔥 {userData.streak} day
      </span>
    </div>

  </div>
</div>

      {/* Quick Actions */}
<div className="mt-12 rounded-3xl bg-white p-8 shadow-lg">
  <h2 className="text-3xl font-bold text-slate-900">
    Quick Actions
  </h2>

  <p className="mt-2 text-slate-500">
    Continue learning with one click.
  </p>

  <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

    {/* START SPEAKING */}
    <button
      onClick={() => navigate("/practice")}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl"
    >
      <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700 transition-transform duration-300 group-hover:scale-110">
        <FaMicrophone />
      </div>

      <div>
        <h3 className="font-bold text-slate-900">
          Start Speaking
        </h3>

        <p className="text-sm text-slate-500">
          Practice with AI
        </p>
      </div>
    </button>

    {/* VOICE ROOMS */}
    <button
      onClick={() => navigate("/rooms")}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl"
    >
      <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700 transition-transform duration-300 group-hover:scale-110">
        <FaUsers />
      </div>

      <div>
        <h3 className="font-bold text-slate-900">
          Voice Rooms
        </h3>

        <p className="text-sm text-slate-500">
          Join live learners
        </p>
      </div>
    </button>

    {/* RANDOM VOICE CALL */}
    <button
      onClick={() => navigate("/random-call")}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl"
    >
      <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700 transition-transform duration-300 group-hover:scale-110">
        <FaRandom />
      </div>

      <div>
        <h3 className="font-bold text-slate-900">
          Random Voice Call
        </h3>

        <p className="text-sm text-slate-500">
          Find a speaking partner
        </p>
      </div>
    </button>

    {/* VOCABULARY */}
    <button
      onClick={() => navigate("/vocabulary")}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl"
    >
      <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700 transition-transform duration-300 group-hover:scale-110">
        <FaBookOpen />
      </div>

      <div>
        <h3 className="font-bold text-slate-900">
          Vocabulary
        </h3>

        <p className="text-sm text-slate-500">
          Learn new words
        </p>
      </div>
    </button>

    {/* DAILY CHALLENGE */}
    <button
      onClick={() => navigate("/daily-challenge")}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl"
    >
      <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700 transition-transform duration-300 group-hover:scale-110">
        <FaBullseye />
      </div>

      <div>
        <h3 className="font-bold text-slate-900">
          Daily Challenge
        </h3>

        <p className="text-sm text-slate-500">
          Practice speaking every day
        </p>
      </div>
    </button>
{/* LEADERBOARD */}
<button
  onClick={() => navigate("/leaderboard")}
  className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl"
>
  <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700 transition-transform duration-300 group-hover:scale-110">
    <FaTrophy />
  </div>

  <div>
    <h3 className="font-bold text-slate-900">
      Leaderboard
    </h3>

    <p className="text-sm text-slate-500">
      See your ranking
    </p>
  </div>
</button>

{/* ACHIEVEMENTS */}
<button
  onClick={() => navigate("/achievements")}
  className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl"
>
  <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700 transition-transform duration-300 group-hover:scale-110">
    <FaMedal />
  </div>

  <div>
    <h3 className="font-bold text-slate-900">
      Achievements
    </h3>

    <p className="text-sm text-slate-500">
      View your badges
    </p>
  </div>
</button>
  </div>
</div>
</main>
    </div>
  );
}