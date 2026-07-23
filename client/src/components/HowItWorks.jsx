import { FaMicrophoneAlt, FaRobot, FaChartLine } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaMicrophoneAlt size={35} />,
      title: "Speak",
      description:
        "Start speaking naturally with your AI tutor or join a live voice room.",
    },
    {
      icon: <FaRobot size={35} />,
      title: "AI Understands",
      description:
        "Our AI analyzes pronunciation, grammar, vocabulary and confidence in real time.",
    },
    {
      icon: <FaChartLine size={35} />,
      title: "Improve",
      description:
        "Receive instant feedback, track your progress and become fluent every day.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">
          <p className="text-blue-600 uppercase font-semibold tracking-widest">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Learn English in 3 Simple Steps
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-gray-600">
            SpeakSphere makes English learning interactive, personalized and
            enjoyable using Artificial Intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mt-16">

          {steps.map((step, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-10 text-center transition duration-300 hover:-translate-y-3 hover:shadow-2xl"
            >

              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                {step.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                {step.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                {step.description}
              </p>

              <div className="mt-8 text-5xl font-bold text-gray-200">
                0{index + 1}
              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}