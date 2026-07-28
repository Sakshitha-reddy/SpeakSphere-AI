import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f0ff] px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Create Account
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Join SpeakSphere and start improving your English.
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 font-semibold text-white transition hover:scale-[1.02]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-violet-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}