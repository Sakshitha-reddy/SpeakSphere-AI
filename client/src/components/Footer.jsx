import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1c1633] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo */}

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-xl font-bold">
                S
              </div>

              <h2 className="text-3xl font-bold">
                SpeakSphere
              </h2>

            </div>

            <p className="mt-6 leading-7 text-slate-300">
              AI-powered English learning platform helping learners
              improve confidence, pronunciation and fluency through
              smart practice.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="mb-6 text-xl font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-3 text-slate-300">

              <li><a href="#">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#community">Testimonials</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#contact">Contact</a></li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-6 text-xl font-semibold">
              Contact
            </h3>

            <div className="space-y-3 text-slate-300">

              <p>📧 hello@speaksphere.ai</p>

              <p>📞 +91 98765 43210</p>

              <p>📍 Hyderabad, India</p>

            </div>

          </div>

          {/* Social */}

          <div>

            <h3 className="mb-6 text-xl font-semibold">
              Follow Us
            </h3>

            <div className="flex gap-4 text-2xl">

              <a href="#" className="transition hover:text-violet-400">
                <FaGithub />
              </a>

              <a href="#" className="transition hover:text-violet-400">
                <FaLinkedin />
              </a>

              <a href="#" className="transition hover:text-violet-400">
                <FaTwitter />
              </a>

              <a href="#" className="transition hover:text-violet-400">
                <FaInstagram />
              </a>

            </div>

          </div>

        </div>

        <div className="mt-14 border-t border-slate-700 pt-8 text-center text-slate-400">

          © 2026 SpeakSphere AI. All rights reserved.

        </div>

      </div>
    </footer>
  );
}