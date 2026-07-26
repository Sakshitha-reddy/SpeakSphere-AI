export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      button: "Start Free",
      featured: false,
      features: [
        "AI Chat Practice",
        "Basic Pronunciation Feedback",
        "Daily Challenges",
        "Community Access",
      ],
    },
    {
      name: "Pro",
      price: "$9",
      period: "/month",
      button: "Get Pro",
      featured: true,
      features: [
        "Everything in Free",
        "Unlimited AI Speaking",
        "Live Voice Rooms",
        "Progress Analytics",
        "Priority Support",
      ],
    },
    {
      name: "Premium",
      price: "$19",
      period: "/month",
      button: "Go Premium",
      featured: false,
      features: [
        "Everything in Pro",
        "1-on-1 AI Tutor",
        "Unlimited Voice Calls",
        "Personal Learning Plan",
        "Certificates",
      ],
    },
  ];

  return (
    <section id="pricing" className="bg-[#f6f0ff] py-10">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <p className="mb-3 font-semibold uppercase tracking-[0.35em] text-violet-600">
            Pricing
          </p>

          <h2 className="text-5xl font-bold text-slate-900">
            Choose Your Learning Plan
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            Whether you're just getting started or becoming fluent,
            SpeakSphere has a plan designed for you.
          </p>
        </div>

        {/* Pricing Cards */}

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                plan.featured
                  ? "border-violet-500 ring-2 ring-violet-500 scale-105"
                  : "border-slate-200"
              }`}
            >
              {plan.featured && (
                <span className="mb-5 inline-block rounded-full bg-violet-600 px-4 py-1 text-sm font-semibold text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-3xl font-bold text-slate-900">
                {plan.name}
              </h3>

              <div className="mt-5">
                <span className="text-5xl font-bold text-violet-600">
                  {plan.price}
                </span>

                <span className="text-slate-500">
                  {plan.period}
                </span>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-slate-600"
                  >
                    <span className="text-violet-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-10 w-full rounded-xl py-3 font-semibold transition ${
                  plan.featured
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white hover:scale-105"
                    : "border border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}