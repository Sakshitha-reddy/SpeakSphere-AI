import {
  FaArrowRight,
  FaPlay,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";

export default function Hero() {
  return (
    <section id="home" className="bg-[#f6f0ff] pt-8 pb-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row">

        {/* Left */}
        <div className="flex-1">

          <span className="inline-block rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
            ✨ AI Powered English Learning
          </span>

          <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
  Speak English
  <br />
  <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
    Like Never Before.
  </span>
</h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-500">
            Practice spoken English with your own AI coach, receive instant
            pronunciation feedback, and join live voice rooms with learners
            around the world.
          </p>

          <div className="mt-10 flex gap-5">

            <button className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-105">
              Start Speaking
              <FaArrowRight />
            </button>

            <button className="mt-10 ml-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 shadow-sm transition hover:shadow-lg">
              <FaPlay />
              Watch Demo
            </button>

          </div>

        </div>

        {/* Right */}
        <div className="flex-1">

          <div className="rounded-3xl bg-white p-10 shadow-2xl max-w-xl">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  AI Coach
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Nova AI
                </h3>

              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-2xl text-white">
                🤖
              </div>

            </div>

            <div className="mt-8 rounded-2xl bg-violet-50 p-5 text-slate-700 italic">
              "Excellent pronunciation! Try speaking slightly slower to sound
              even more natural."
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5">

              <div className="rounded-2xl bg-violet-50 p-5">
                <FaMicrophoneAlt className="text-3xl text-violet-600" />
                <h4 className="mt-4 font-bold">
                  Pronunciation
                </h4>
                <p className="mt-2 text-2xl font-bold text-violet-600">
                  94%
                </p>
              </div>

              <div className="rounded-2xl bg-pink-50 p-5">
                <FaChartLine className="text-3xl text-pink-500" />
                <h4 className="mt-4 font-bold">
                  Fluency
                </h4>
                <p className="mt-2 text-2xl font-bold text-pink-500">
                  92%
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}