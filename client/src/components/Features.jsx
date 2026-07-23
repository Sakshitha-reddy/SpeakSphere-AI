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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Features
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Everything You Need To Speak English Confidently
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            SpeakSphere combines AI, live conversations and smart analytics
            into one platform that helps you become fluent faster.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl text-blue-600">
                {feature.icon}
              </div>

              <h3 className="mb-3 text-2xl font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="leading-7 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}