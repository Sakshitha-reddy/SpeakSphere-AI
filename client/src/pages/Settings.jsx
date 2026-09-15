import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaUser, FaBell, FaMoon } from "react-icons/fa";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
function Settings() {
    
     const [userData, setUserData] = useState({
  name: "",
  email: "",
  notifications: null,
});
const [notificationLoading, setNotificationLoading] = useState(false);
const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
  const data = userSnap.data();

  setUserData({
    name: data.name || user.displayName || "Sakshitha",
    email: user.email || "",
    notifications: data.notifications ?? true,
  });
}

setLoading(false);
  } catch (error) {
  console.error("❌ Error loading settings:", error);
  setLoading(false);
}
  });

  return () => unsubscribe();
}, []);
    const handleSaveName = async () => {
    const user = auth.currentUser;

    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        name: userData.name,
      });

      alert("Name updated successfully!");
    } catch (error) {
      console.error("❌ Error updating name:", error);
      alert("Failed to update name.");
    }
  };
const handleNotificationToggle = async () => {
  const user = auth.currentUser;

  if (!user) return;

  const newValue = !userData.notifications;

  try {
    setNotificationLoading(true);

    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      notifications: newValue,
    });

    setUserData({
      ...userData,
      notifications: newValue,
    });
  } catch (error) {
    console.error("❌ Error updating notifications:", error);
    alert("Failed to update notifications.");
  } finally {
    setNotificationLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-[#f6f0ff] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 rounded-xl bg-violet-100 px-4 py-3 text-violet-700 transition hover:bg-violet-200"
        >
          <FaArrowLeft />
          Back to Dashboard
        </Link>

        <div className="rounded-3xl border border-violet-100 bg-white p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-slate-900">
            ⚙️ Settings
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your SpeakSphere preferences.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-violet-50 p-5">
  <div className="flex items-center gap-4">
    <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
      <FaUser />
    </div>

    <div>
      <h3 className="font-semibold text-slate-900">Account</h3>
      <p className="text-sm text-slate-500">
        Manage your profile information.
      </p>
    </div>
  </div>

  <div className="mt-5 space-y-3">
    <div>
      <label className="text-sm font-medium text-slate-700">
        Name
      </label>
      <input
  type="text"
  value={userData.name}
  onChange={(e) =>
    setUserData({
      ...userData,
      name: e.target.value,
    })
  }
  className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-slate-700 outline-none"
/>
    </div>

    <div>
      <label className="text-sm font-medium text-slate-700">
        Email
      </label>
      <input
        type="email"
        value={userData.email}
        readOnly
        className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-slate-700 outline-none"
      />
      <button
  onClick={handleSaveName}
  className="mt-4 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
>
  Save Changes
</button>
    </div>
  </div>
</div>

            <div className="rounded-2xl bg-violet-50 p-5">
  <div className="flex items-center gap-4">
    <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
      <FaBell />
    </div>

    <div>
      <h3 className="font-semibold text-slate-900">
        Notifications
      </h3>

      <p className="text-sm text-slate-500">
        Notification preferences.
      </p>
    </div>
  </div>

  <div className="mt-5 flex items-center justify-between rounded-xl bg-white p-4">
    <div>
      <p className="font-medium text-slate-900">
        Daily reminders
      </p>

      <p className="text-sm text-slate-500">
        Get reminders to practice English.
      </p>
    </div>

 <button
  onClick={loading || notificationLoading ? undefined : handleNotificationToggle}
  className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
    loading || notificationLoading
      ? "bg-slate-300 cursor-not-allowed"
      : userData.notifications
        ? "bg-violet-600 hover:bg-violet-700"
        : "bg-slate-400 hover:bg-slate-500"
  }`}
>
  {loading || notificationLoading
    ? "Loading..."
    : userData.notifications
      ? "On"
      : "Off"}
</button>
  </div>
</div>

           <div className="rounded-2xl bg-violet-50 p-5">
  <div className="flex items-center gap-4">
    <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
      <FaMoon />
    </div>

    <div>
      <h3 className="font-semibold text-slate-900">
        Appearance
      </h3>

      <p className="text-sm text-slate-500">
        Choose how SpeakSphere looks.
      </p>
    </div>
  </div>

  <div className="mt-5 flex items-center justify-between rounded-xl bg-white p-4">
    <div>
      <p className="font-medium text-slate-900">
        Theme
      </p>

      <p className="text-sm text-slate-500">
        Dark mode will be available soon.
      </p>
    </div>

    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
      Light
    </span>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;