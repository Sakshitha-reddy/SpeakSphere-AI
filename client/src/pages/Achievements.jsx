import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

function Achievements() {
  const [userData, setUserData] = useState({
  streak: 0,
  practiceSessions: 0,
  vocabulary: 0,
  lessonsCompleted: 0,
}); 

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;

      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } catch (error) {
        console.error("❌ Error loading achievements:", error);
      }
    };

    loadUserData();
  }, []);

  const sevenDayWarrior = userData.streak >= 7;
  const speakingStarter = userData.practiceSessions >= 5;
  const vocabularyMaster = userData.vocabulary >= 50;
  const challengeChampion = userData.lessonsCompleted >= 10;

  return (
    <div className="min-h-screen bg-[#f6f0ff] px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            🏅 Achievements
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Complete challenges and unlock badges!
          </p>
        </div>

        {/* Achievement Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

          {/* 7-Day Warrior */}
          <div
            className={`rounded-3xl border p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
              sevenDayWarrior
                ? "border-violet-200 bg-white"
                : "border-slate-200 bg-slate-100"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-4xl">
              🔥
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              7-Day Warrior
            </h2>

            <p className="mt-3 leading-6 text-slate-600">
              Maintain a 7-day learning streak.
            </p>

            <div className="mt-6">
              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  sevenDayWarrior
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {sevenDayWarrior ? "🏆 Unlocked!" : "🔒 Locked"}
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Current streak:{" "}
              <span className="font-semibold text-slate-700">
                {userData.streak || 0} days
              </span>
            </p>
          </div>

          {/* Speaking Starter */}
          <div
            className={`rounded-3xl border p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
              speakingStarter
                ? "border-violet-200 bg-white"
                : "border-slate-200 bg-slate-100"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-4xl">
              🎤
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Speaking Starter
            </h2>

            <p className="mt-3 leading-6 text-slate-600">
              Complete 5 AI speaking practice sessions.
            </p>

            <div className="mt-6">
              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  speakingStarter
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {speakingStarter ? "🏆 Unlocked!" : "🔒 Locked"}
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Practice sessions:{" "}
              <span className="font-semibold text-slate-700">
                {userData.practiceSessions || 0}
              </span>
            </p>
          </div>

          {/* Vocabulary Master */}
          <div
            className={`rounded-3xl border p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
              vocabularyMaster
                ? "border-violet-200 bg-white"
                : "border-slate-200 bg-slate-100"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-4xl">
              📚
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Vocabulary Master
            </h2>

            <p className="mt-3 leading-6 text-slate-600">
              Learn 50 vocabulary words.
            </p>

            <div className="mt-6">
              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  vocabularyMaster
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {vocabularyMaster ? "🏆 Unlocked!" : "🔒 Locked"}
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Words learned:{" "}
              <span className="font-semibold text-slate-700">
                {userData.vocabulary || 0}
              </span>
            </p>
          </div>

        
      {/* Challenge Champion */}
<div
  className={`rounded-3xl border p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
    challengeChampion
      ? "border-violet-200 bg-white"
      : "border-slate-200 bg-slate-100"
  }`}
>
  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-4xl">
    🏆
  </div>

  <h2 className="mt-6 text-2xl font-bold text-slate-900">
    Challenge Champion
  </h2>

  <p className="mt-3 leading-6 text-slate-600">
    Complete 10 daily challenges.
  </p>

  <div className="mt-6">
    <span
      className={`rounded-full px-4 py-2 text-sm font-bold ${
        challengeChampion
          ? "bg-green-100 text-green-700"
          : "bg-slate-200 text-slate-600"
      }`}
    >
      {challengeChampion ? "🏆 Unlocked!" : "🔒 Locked"}
    </span>
  </div>

  <p className="mt-5 text-sm text-slate-500">
    Challenges completed:{" "}
    <span className="font-semibold text-slate-700">
      {userData.lessonsCompleted || 0}
    </span>
  </p>
</div>
    </div>
     </div>
      </div>
  );
}

export default Achievements;