import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-[#f6f0ff] py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">

        {/* Left */}

        <div>

          <p className="mb-3 font-semibold uppercase tracking-[0.35em] text-violet-600">
            Contact
          </p>

          <h2 className="text-5xl font-bold text-slate-900">
            We'd Love To Hear From You
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Have questions about SpeakSphere? Want to know more
            about AI-powered English learning?
            Send us a message and we'll get back to you soon.
          </p>

          <div className="mt-10 space-y-6">

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-violet-100 p-4">
                <FaPhoneAlt className="text-violet-600" />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Phone
                </p>

                <p className="text-slate-600">
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-violet-100 p-4">
                <FaEnvelope className="text-violet-600" />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Email
                </p>

                <p className="text-slate-600">
                  hello@speaksphere.ai
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-violet-100 p-4">
                <FaMapMarkerAlt className="text-violet-600" />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Location
                </p>

                <p className="text-slate-600">
                  Hyderabad, India
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="rounded-3xl bg-white p-10 shadow-xl">

          <form className="space-y-6">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-xl border border-slate-200 px-5 py-4 outline-none focus:border-violet-500"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full rounded-xl border border-slate-200 px-5 py-4 outline-none focus:border-violet-500"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full rounded-xl border border-slate-200 px-5 py-4 outline-none focus:border-violet-500"
            ></textarea>

            <button
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-4 font-semibold text-white transition hover:scale-105"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}