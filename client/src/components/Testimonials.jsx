import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Sarah M.",
    country: "United Kingdom",
    review:
      "SpeakSphere completely changed my confidence. I can finally speak English without hesitation.",
  },
  {
    name: "Rahul K.",
    country: "India",
    review:
      "The AI pronunciation feedback is incredibly accurate. I improved every single week.",
  },
  {
    name: "Maria S.",
    country: "Spain",
    review:
      "The live voice rooms helped me overcome my fear of speaking with strangers.",
  },
];

export default function Testimonials() {
  return (
    <section id="community" className="bg-[#f6f0ff] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
            TESTIMONIALS
          </p>

          <h2 className="mt-4 text-5xl font-bold text-slate-900">
            Loved By English Learners Worldwide
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-500">
            Thousands of learners use SpeakSphere every day to improve their
            confidence, pronunciation and fluency.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          {testimonials.map((user) => (

            <div
              key={user.name}
              className="rounded-3xl border border-slate-100 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="mb-6 flex text-yellow-400">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <p className="leading-8 text-slate-600">
                "{user.review}"
              </p>

              <div className="mt-8 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-lg font-bold text-white">
                  {user.name.charAt(0)}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    {user.name}
                  </h4>

                  <p className="text-sm text-slate-500">
                    {user.country}
                  </p>
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}