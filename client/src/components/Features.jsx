import {
  FaRobot,
  FaMicrophoneAlt,
  FaUsers,
  FaChartLine,
  FaFire,
  FaTrophy,
} from "react-icons/fa";

const features = [
  {
    icon: <FaRobot />,
    title: "AI Speaking Coach",
    description:
      "Practice conversations with an AI tutor that gives instant corrections and feedback.",
  },
  {
    icon: <FaMicrophoneAlt />,
    title: "Voice Practice",
    description:
      "Improve pronunciation and fluency through real-time speaking exercises.",
  },
  {
    icon: <FaUsers />,
    title: "Live Voice Rooms",
    description:
      "Join voice rooms and practice English with learners from around the world.",
  },
  {
    icon: <FaChartLine />,
    title: "Progress Tracking",
    description:
      "Track your fluency, pronunciation, vocabulary and speaking confidence.",
  },
  {
    icon: <FaFire />,
    title: "Daily Challenges",
    description:
      "Complete daily speaking tasks to maintain your learning streak.",
  },
  {
    icon: <FaTrophy />,
    title: "Leaderboard",
    description:
      "Compete with learners globally and earn achievements as you improve.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-[#f6f0ff] pt-10 pb-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
            FEATURES
          </p>

          <h2 className="mt-4 text-5xl font-bold text-slate-900">
            Everything You Need To Speak English Confidently
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-500">
            SpeakSphere combines AI, live conversations and smart analytics
            into one platform that helps you become fluent faster.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-3xl text-white">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-4 leading-8 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}