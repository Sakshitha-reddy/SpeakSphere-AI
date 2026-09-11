import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaSearch,
  FaVolumeUp,
  FaCheck,
} from "react-icons/fa";

import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";

export default function Vocabulary() {
  const [search, setSearch] = useState("");
  const [learnedWords, setLearnedWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const words = [
  {
    word: "Confident",
    meaning: "Feeling sure about your abilities or decisions.",
    example: "She felt confident while speaking English in front of the class.",
    pronunciation: "kon-fi-dent",
  },
  {
    word: "Fluent",
    meaning: "Able to speak a language easily and naturally.",
    example: "He became fluent in English after practicing every day.",
    pronunciation: "floo-ent",
  },
  {
    word: "Improve",
    meaning: "To become better at something.",
    example: "I want to improve my English speaking skills.",
    pronunciation: "im-proov",
  },
  {
    word: "Curious",
    meaning: "Wanting to learn or know more about something.",
    example: "She is curious about how artificial intelligence works.",
    pronunciation: "kyoo-ree-us",
  },
  {
    word: "Communicate",
    meaning: "To share information, ideas, or feelings with someone.",
    example: "Good communication is important when learning a language.",
    pronunciation: "kuh-myoo-ni-kayt",
  },
  {
    word: "Opportunity",
    meaning: "A good chance to do or achieve something.",
    example: "Learning English can create many career opportunities.",
    pronunciation: "op-er-too-ni-tee",
  },
  {
    word: "Achieve",
    meaning: "To successfully reach a goal.",
    example: "She worked hard to achieve her dream.",
    pronunciation: "uh-cheev",
  },
  {
    word: "Confusing",
    meaning: "Difficult to understand or explain.",
    example: "The instructions were confusing at first.",
    pronunciation: "kuhn-fyoo-zing",
  },
  {
    word: "Express",
    meaning: "To show or communicate an idea or feeling.",
    example: "It is important to express your thoughts clearly.",
    pronunciation: "ik-spres",
  },
  {
    word: "Practice",
    meaning: "To do something repeatedly to improve a skill.",
    example: "You should practice speaking English every day.",
    pronunciation: "prak-tis",
  },
  {
    word: "Conversation",
    meaning: "A talk between two or more people.",
    example: "We had a short conversation in English.",
    pronunciation: "kon-ver-say-shun",
  },
  {
    word: "Vocabulary",
    meaning: "The words that a person knows or uses.",
    example: "Reading books can improve your vocabulary.",
    pronunciation: "voh-kab-yuh-lair-ee",
  },
  {
    word: "Grammar",
    meaning: "The rules used to form correct sentences.",
    example: "Good grammar makes your writing clearer.",
    pronunciation: "gram-er",
  },
  {
    word: "Pronounce",
    meaning: "To say a word correctly.",
    example: "Can you pronounce this word correctly?",
    pronunciation: "pruh-nowns",
  },
  {
    word: "Understand",
    meaning: "To know the meaning of something.",
    example: "I understand the question now.",
    pronunciation: "un-der-stand",
  },
  {
    word: "Explain",
    meaning: "To make something clear or easy to understand.",
    example: "The teacher explained the topic clearly.",
    pronunciation: "ik-splayn",
  },
  {
    word: "Respond",
    meaning: "To answer or react to something.",
    example: "Please respond to the question in English.",
    pronunciation: "ri-spond",
  },
  {
    word: "Confusion",
    meaning: "A feeling of not understanding something clearly.",
    example: "The teacher cleared up my confusion.",
    pronunciation: "kuhn-fyoo-zhun",
  },
  {
    word: "Accurate",
    meaning: "Correct and free from mistakes.",
    example: "Try to give an accurate answer.",
    pronunciation: "ak-yuh-rut",
  },
  {
    word: "Effective",
    meaning: "Successful in producing the desired result.",
    example: "Practice is an effective way to improve speaking.",
    pronunciation: "ih-fek-tiv",
  },
  {
    word: "Challenge",
    meaning: "Something difficult that tests your ability.",
    example: "Speaking with strangers can be a challenge.",
    pronunciation: "chal-inj",
  },
  {
    word: "Progress",
    meaning: "Movement toward improvement or a goal.",
    example: "I can see progress in my English speaking.",
    pronunciation: "prog-res",
  },
  {
    word: "Fluency",
    meaning: "The ability to speak smoothly and naturally.",
    example: "Regular practice can improve your fluency.",
    pronunciation: "floo-en-see",
  },
  {
    word: "Natural",
    meaning: "Normal and comfortable rather than forced.",
    example: "She speaks English in a very natural way.",
    pronunciation: "nach-er-ul",
  },
  {
    word: "Confidently",
    meaning: "In a confident or self-assured way.",
    example: "He answered the question confidently.",
    pronunciation: "kon-fi-dent-lee",
  },
  {
    word: "Encourage",
    meaning: "To give someone support or confidence.",
    example: "My teacher always encourages me to speak English.",
    pronunciation: "en-kur-ij",
  },
  {
    word: "Motivate",
    meaning: "To give someone a reason or desire to do something.",
    example: "Daily goals motivate me to keep learning.",
    pronunciation: "moh-tuh-vayt",
  },
  {
    word: "Habit",
    meaning: "Something you do regularly.",
    example: "Speaking English every day can become a good habit.",
    pronunciation: "hab-it",
  },
 
  {
    word: "Professional",
    meaning: "Relating to a job or career.",
    example: "Good communication is important in a professional environment.",
    pronunciation: "pruh-fesh-uh-nul",
  },
];
  // =====================================
  // LOAD LEARNED WORDS FROM FIREBASE
  // =====================================

  useEffect(() => {
    const loadLearnedWords = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          if (Array.isArray(data.learnedWords)) {
            setLearnedWords(data.learnedWords);
          }
        }
      } catch (error) {
        console.error(
          "❌ Error loading vocabulary:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadLearnedWords();
  }, []);

  // =====================================
  // MARK WORD AS LEARNED / UNLEARNED
  // =====================================

  const markAsLearned = async (word) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in first.");
      return;
    }

    let updatedWords;
    let earnedPoints = false;

   if (learnedWords.includes(word)) {
  updatedWords = learnedWords.filter(
    (item) => item !== word
  );
} else {
  updatedWords = [...learnedWords, word];

  
}

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
const userData = userSnap.exists() ? userSnap.data() : {};

const rewardedVocabularyWords =
  userData.rewardedVocabularyWords || [];
  if (!rewardedVocabularyWords.includes(word)) {
  earnedPoints = true;
}

      await setDoc(
        userRef,
        {
          learnedWords: updatedWords,
          vocabulary: updatedWords.length,
          ...(earnedPoints
  ? {
      points: increment(10),
      rewardedVocabularyWords: [
        ...rewardedVocabularyWords,
        word,
      ],
    }
  : {}),
        },
        {
          merge: true,
        }
      );

      setLearnedWords(updatedWords);

      console.log(
        "✅ Vocabulary updated:",
        updatedWords
      );
    } catch (error) {
      console.error(
        "❌ Error saving vocabulary:",
        error
      );

      alert(
        "Unable to save vocabulary right now."
      );
    }
  };

  // =====================================
  // SPEAK WORD
  // =====================================

  const speakWord = (word) => {
    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(word);

    speech.lang = "en-US";
    speech.rate = 0.8;

    window.speechSynthesis.speak(speech);
  };

  // =====================================
  // SEARCH
  // =====================================

  const filteredWords = words.filter((item) =>
    item.word
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f0ff]">
        <h1 className="text-2xl font-bold text-violet-700">
          Loading vocabulary...
        </h1>
      </div>
    );
  }

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-h-screen bg-[#f6f0ff]">

      {/* HEADER */}

      <header className="border-b border-violet-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div className="flex items-center gap-5">

            <Link
              to="/dashboard"
              className="rounded-xl bg-violet-100 p-3 text-violet-700 transition hover:bg-violet-200"
            >
              <FaArrowLeft />
            </Link>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Vocabulary
              </h1>

              <p className="text-slate-500">
                Learn new words and improve your English.
              </p>
            </div>

          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-xl text-white">
            <FaBookOpen />
          </div>

        </div>
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-8 py-10">

        {/* INTRO */}

        <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-500 p-8 text-white shadow-lg">

          <h2 className="text-3xl font-bold">
            Build Your Vocabulary 🚀
          </h2>

          <p className="mt-3 max-w-2xl text-violet-100">
            Learn useful English words, understand their
            meanings, listen to pronunciation, and practice
            using them in sentences.
          </p>

        </div>

        {/* PROGRESS */}

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-500">
                Words Learned
              </p>

              <h3 className="mt-1 text-3xl font-bold text-violet-700">
                {learnedWords.length}

                <span className="text-lg font-normal text-slate-400">
                  {" "}
                  / {words.length}
                </span>
              </h3>
            </div>

            <div className="h-4 w-48 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-500"
                style={{
                  width: `${
                    Math.min(
                      (learnedWords.length /
                        words.length) *
                        100,
                      100
                    )
                  }%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* SEARCH */}

        <div className="relative mt-8">

          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search a word..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-2xl border border-violet-100 bg-white py-4 pl-14 pr-5 text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

        </div>

        {/* WORD CARDS */}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredWords.map((item) => {

            const isLearned =
              learnedWords.includes(item.word);

            return (
              <div
                key={item.word}
                className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-2xl font-bold text-slate-900">
                      {item.word}
                    </h3>

                    <p className="mt-1 text-sm text-violet-600">
                      {item.pronunciation}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      speakWord(item.word)
                    }
                    className="rounded-xl bg-violet-100 p-3 text-violet-700 transition hover:bg-violet-200"
                    title="Listen to pronunciation"
                  >
                    <FaVolumeUp />
                  </button>

                </div>

                <div className="mt-5">

                  <p className="font-semibold text-slate-700">
                    Meaning
                  </p>

                  <p className="mt-2 leading-7 text-slate-500">
                    {item.meaning}
                  </p>

                </div>

                <div className="mt-5 rounded-2xl bg-violet-50 p-4">

                  <p className="text-sm font-semibold text-violet-700">
                    Example
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    "{item.example}"
                  </p>

                </div>

                <button
                  onClick={() =>
                    markAsLearned(item.word)
                  }
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
                    isLearned
                      ? "bg-green-100 text-green-700"
                      : "bg-violet-600 text-white hover:bg-violet-700"
                  }`}
                >

                  <FaCheck />

                  {isLearned
                    ? "Learned"
                    : "Mark as Learned"}

                </button>

              </div>
            );
          })}

        </div>

        {/* NO RESULTS */}

        {filteredWords.length === 0 && (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-lg">

            <FaSearch className="mx-auto text-4xl text-violet-300" />

            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              No words found
            </h3>

            <p className="mt-2 text-slate-500">
              This word isn't in your current vocabulary list yet.
            </p>

          </div>
        )}

      </main>
    </div>
  );
}