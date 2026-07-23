import { FaArrowRight, FaPlay, FaMicrophoneAlt } from "react-icons/fa";


export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">

        <div className="hero-left">

          <span className="hero-badge">
            ✨ AI Powered English Learning
          </span>

          <h1>
            Speak English
            <br />
            <span>With Confidence.</span>
          </h1>

          <p>
            Practice spoken English with your own AI coach, receive instant
            pronunciation feedback, and join live voice rooms with learners
            around the world.
          </p>

          <div className="hero-buttons">

            <button className="hero-primary">
              Start Learning
              <FaArrowRight />
            </button>

            <button className="hero-secondary">
              <FaPlay />
              Watch Demo
            </button>

          </div>

        </div>

        <div className="hero-right">

          <div className="coach-card">

            <div className="coach-header">
              <div>
                <h3>AI Coach</h3>
                <p>Live Speaking Session</p>
              </div>

              <div className="coach-icon">
                🤖
              </div>
            </div>

            <div className="message">
              "Excellent pronunciation! Try speaking slightly slower to sound
              even more natural."
            </div>

            <div className="stats">

              <div className="stat-box">
                <FaMicrophoneAlt />
                <h4>Pronunciation</h4>
                <span>94%</span>
              </div>

              <div className="stat-box">
                📈
                <h4>Fluency</h4>
                <span>92%</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}