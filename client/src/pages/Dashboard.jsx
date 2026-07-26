import {
  FaUsers,
  FaBookOpen,
} from "react-icons/fa";
import { FaMicrophone, FaArrowRight } from "react-icons/fa";
export default function Dashboard() {
  const stats = [
    {
      title: "Current Streak",
      value: "🔥 12",
      subtitle: "Days",
    },
    {
      title: "Fluency Score",
      value: "92%",
      subtitle: "Excellent",
    },
    {
      title: "Lessons Completed",
      value: "48",
      subtitle: "Lessons",
    },
    {
      title: "Today's Goal",
      value: "30 min",
      subtitle: "Practice",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f0ff]">
      {/* Header */}
      <header className="border-b border-purple-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <h1 className="text-3xl font-bold text-slate-900">
            SpeakSphere
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
              S
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-10">

        <h2 className="text-4xl font-bold text-slate-900">
          Welcome Back 👋
        </h2>

        <p className="mt-2 text-lg text-slate-600">
          Continue improving your English today.
        </p>

        {/* Stats */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <p className="text-slate-500">{stat.title}</p>

              <h3 className="mt-4 text-4xl font-bold text-violet-600">
                {stat.value}
              </h3>

              <p className="mt-2 text-slate-500">
                {stat.subtitle}
              </p>
            </div>
            
          ))}
        </div>
        {/* Dashboard Content */}
<div className="mt-12 grid gap-8 lg:grid-cols-2">

  {/* AI Coach Card */}
  <div className="rounded-3xl bg-white p-8 shadow-lg">

    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-2xl text-white">
        <FaMicrophone />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-slate-900">
          AI Speaking Coach
        </h3>

        <p className="text-slate-500">
          Practice English with instant AI feedback.
        </p>
      </div>
    </div>

    <p className="mt-8 leading-8 text-slate-600">
      Start a conversation with your AI tutor to improve your pronunciation,
      grammar and fluency.
    </p>

    <button className="mt-8 flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 font-semibold text-white transition hover:scale-105">
      Start Practice
      <FaArrowRight />
    </button>

  </div>

  {/* Weekly Progress Placeholder */}
  <div className="rounded-3xl bg-white p-8 shadow-lg">

    <h3 className="text-2xl font-bold text-slate-900">
  Weekly Progress
</h3>

<p className="mt-2 text-slate-500">
  You've completed 75% of this week's goal.
</p>

<div className="mt-8">

  <div className="mb-3 flex justify-between text-sm font-medium">
    <span>Progress</span>
    <span>75%</span>
  </div>

  <div className="h-4 rounded-full bg-slate-200">
    <div className="h-4 w-3/4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"></div>
  </div>

</div>

<div className="mt-8 space-y-5">

  <div className="flex justify-between">
    <span className="text-slate-600">Lessons This Week</span>
    <span className="font-bold">15</span>
  </div>

  <div className="flex justify-between">
    <span className="text-slate-600">Speaking Practice</span>
    <span className="font-bold">6 hrs</span>
  </div>

  <div className="flex justify-between">
    <span className="text-slate-600">Vocabulary Learned</span>
    <span className="font-bold">128 Words</span>
  </div>

</div>

  </div>

</div>
{/* Quick Actions */}

<div className="mt-12 rounded-3xl bg-white p-8 shadow-lg">

  <h2 className="text-3xl font-bold text-slate-900">
    Quick Actions
  </h2>

  <p className="mt-2 text-slate-500">
    Continue learning with one click.
  </p>

  <div className="mt-8 grid gap-6 md:grid-cols-3">

    <button className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl">

      <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700 transition-transform duration-300 group-hover:scale-110">
        <FaMicrophone />
      </div>

      <div className="text-left">
        <h3 className="font-bold text-slate-900">
          Start Speaking
        </h3>

        <p className="text-sm text-slate-500">
          Practice with AI
        </p>
      </div>

    </button>

    <button className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl">

      <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700 transition-transform duration-300 group-hover:scale-110">
        <FaUsers />
      </div>

      <div className="text-left">
        <h3 className="font-bold text-slate-900">
          Voice Rooms
        </h3>

        <p className="text-sm text-slate-500">
          Join live learners
        </p>
      </div>

    </button>

    <button className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl">

    <div className="rounded-xl bg-violet-100 p-4 text-2xl text-violet-700 transition-transform duration-300 group-hover:scale-110">
        <FaBookOpen />
      </div>

      <div className="text-left">
        <h3 className="font-bold text-slate-900">
          Vocabulary
        </h3>

        <p className="text-sm text-slate-500">
          Learn new words
        </p>
      </div>

    </button>

  </div>

</div>

      </main>
    </div>
  );
}