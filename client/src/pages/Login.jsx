import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f0ff] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-2xl font-bold text-white">
            S
          </div>

          <h1 className="mt-6 text-4xl font-bold text-slate-900">
            Welcome Back 👋
          </h1>

          <p className="mt-3 text-slate-500">
            Login to continue your learning journey.
          </p>
        </div>

        <form className="mt-10 space-y-6">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 outline-none transition focus:border-violet-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-violet-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#" className="text-violet-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 font-semibold text-white transition hover:scale-[1.02]"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600">
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