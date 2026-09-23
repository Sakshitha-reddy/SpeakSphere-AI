import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
    const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    streak: 0,
    points: 0,
    vocabulary: 0,
    practiceSessions: 0,
    lessonsCompleted: 0,
    fluencyScore: 0,
  });

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;

      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData({
            ...userSnap.data(),
            email: user.email || "",
          });
        }
      } catch (error) {
        console.error("❌ Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="profile-page min-h-screen bg-[#f6f0ff] px-6 py-12">
      <div className="mx-auto max-w-5xl">
    <button
  onClick={() => navigate("/dashboard")}
  className="profile-back-btn mb-8 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
>
  ← Back to Dashboard
</button>
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 text-4xl font-bold text-violet-700">
            S
          </div>

          <h1 className="profile-name mt-5 text-4xl font-bold text-slate-900">
  {userData.name || "Sakshitha"}
</h1>

<p className="profile-email mt-2 text-slate-500">
  {userData.email}
</p>

<p className="mt-1 text-sm font-medium text-violet-600">
  English Learner
</p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

         <div className="profile-stat-card rounded-2xl bg-white p-6 text-center shadow-md">
            <p className="text-3xl">🔥</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {userData.streak}
            </p>
            <p className="text-sm text-slate-500">
              Day Streak
            </p>
          </div>

         <div className="profile-stat-card rounded-2xl bg-white p-6 text-center shadow-md">
            <p className="text-3xl">⭐</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {userData.points}
            </p>
            <p className="text-sm text-slate-500">
              Points
            </p>
          </div>

          <div className="profile-stat-card rounded-2xl bg-white p-6 text-center shadow-md">
            <p className="text-3xl">📚</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {userData.vocabulary}
            </p>
            <p className="text-sm text-slate-500">
              Words Learned
            </p>
          </div>

          <div className="profile-stat-card rounded-2xl bg-white p-6 text-center shadow-md">
            <p className="text-3xl">🎤</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {userData.practiceSessions}
            </p>
            <p className="text-sm text-slate-500">
              Practice Sessions
            </p>
          </div>

        </div>

        {/* Learning Progress */}
       <div className="profile-progress-card mt-8 rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="profile-progress-title text-2xl font-bold text-slate-900">
  Learning Progress
</h2>

          <div className="mt-6 space-y-5">

            <div className="profile-progress-item flex items-center justify-between rounded-2xl bg-violet-50 p-5">
              <div>
                <p className="font-semibold text-slate-900">
                  🎯 Challenges Completed
                </p>
                <p className="text-sm text-slate-500">
                  Daily speaking challenges
                </p>
              </div>

              <p className="text-2xl font-bold text-violet-700">
                {userData.lessonsCompleted}
              </p>
            </div>

            <div className="profile-progress-item flex items-center justify-between rounded-2xl bg-violet-50 p-5">
              <div>
                <p className="font-semibold text-slate-900">
                  📊 Fluency Score
                </p>
                <p className="text-sm text-slate-500">
                  Your average speaking score
                </p>
              </div>

              <p className="text-2xl font-bold text-violet-700">
                {userData.fluencyScore}/100
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;