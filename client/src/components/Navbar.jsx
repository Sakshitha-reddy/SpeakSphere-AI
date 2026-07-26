import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto mt-6 flex w-[92%] max-w-7xl items-center justify-between rounded-3xl border border-purple-100 bg-white/80 px-8 py-5 shadow-lg backdrop-blur-xl">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-lg font-bold text-white">
            S
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            SpeakSphere
          </h1>
        </div>

        {/* Menu */}
        <nav className="hidden gap-10 text-[15px] font-medium text-slate-600 lg:flex">
  <a href="#home" className="transition hover:text-violet-600">Home</a>
  <a href="#features" className="transition hover:text-violet-600">Features</a>
  <a href="#community" className="transition hover:text-violet-600">Testimonials</a>
  <a href="#pricing" className="transition hover:text-violet-600">Pricing</a>
  <a href="#contact" className="transition hover:text-violet-600">Contact</a>
</nav>

        {/* Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
  to="/login"
  className="font-medium text-slate-700 hover:text-violet-600"
>
  Login
</Link>

         <Link
  to="/signup"
  className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
>
  Get Started
</Link>
        </div>

      </div>
    </header>
  );
}