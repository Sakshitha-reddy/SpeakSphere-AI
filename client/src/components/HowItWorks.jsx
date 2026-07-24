import { FaMicrophoneAlt, FaBrain, FaChartLine } from "react-icons/fa";

const steps = [
  {
    number: "01",
    icon: <FaMicrophoneAlt />,
    title: "Speak",
    description:
      "Start speaking naturally with your AI tutor or join a live voice room.",
  },
  {
    number: "02",
    icon: <FaBrain />,
    title: "AI Understands",
    description:
      "Our AI analyzes pronunciation, grammar, vocabulary and confidence in real time.",
  },
  {
    number: "03",
    icon: <FaChartLine />,
    title: "Improve",
    description:
      "Receive instant feedback, track your progress and become fluent every day.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#f6f0ff] py-10">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
            HOW IT WORKS
          </p>

          <h2 className="mt-4 text-5xl font-bold text-slate-900">
            Learn English in 3 Simple Steps
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-500">
            SpeakSphere makes English learning interactive, personalized and
            enjoyable using Artificial Intelligence.
          </p>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl bg-white p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-3xl text-white">
                {step.icon}
              </div>

              <div className="mt-6 text-sm font-bold tracking-widest text-violet-600">
                {step.number}
              </div>

              <h3 className="mt-3 text-2xl font-bold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-4 leading-8 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}