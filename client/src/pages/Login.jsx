import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f0ff] px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Login to continue learning with SpeakSphere.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
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
              placeholder="Enter your password"
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
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-violet-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}