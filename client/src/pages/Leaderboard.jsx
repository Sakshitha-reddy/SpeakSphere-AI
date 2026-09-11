import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const leaderboardQuery = query(
          collection(db, "users"),
          orderBy("points", "desc")
        );

        const snapshot = await getDocs(leaderboardQuery);

        const leaderboardUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(leaderboardUsers);
      } catch (error) {
        console.error("❌ Error loading leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-center text-4xl font-bold">
          🏆 Leaderboard
        </h1>

        <p className="mb-10 text-center text-slate-400">
          Compete, practice, and climb the rankings!
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {users.map((user, index) => {
            const isCurrentUser = auth.currentUser?.uid === user.id;

            return (
              <div
                key={user.id}
                className={`flex items-center justify-between border-b border-slate-800 px-6 py-5 last:border-b-0 ${
                  isCurrentUser ? "bg-violet-900/40" : ""
                }`}
              >
                <div className="flex items-center gap-5">
                  <span className="w-10 text-center text-xl font-bold">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : `#${index + 1}`}
                  </span>

                  <div>
                    <p className="font-semibold">
                      {user.name || user.displayName || "Learner"}
                      {isCurrentUser && (
                        <span className="ml-2 text-sm text-violet-300">
                          (You)
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-slate-400">
                      🔥 {user.streak || 0} day streak
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-violet-300">
                    {user.points || 0}
                  </p>
                  <p className="text-xs text-slate-400">Points</p>
                </div>
              </div>
            );
          })}
        </div>

        {users.length === 0 && (
          <p className="mt-8 text-center text-slate-400">
            No leaderboard data yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;