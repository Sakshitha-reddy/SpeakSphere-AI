import { useEffect, useRef, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  addDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

export default function RandomCall() {
  const [status, setStatus] = useState("Ready to find a partner");
  const [isSearching, setIsSearching] = useState(false);
  const [partnerFound, setPartnerFound] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

const localStreamRef = useRef(null);
const remoteStreamRef = useRef(null);
const peerConnectionRef = useRef(null);

  const waitingDocRef = useRef(null);
  const listenerRef = useRef(null);
  const matchIdRef = useRef(null);

  // --------------------------------
  // Stop Firestore listener
  // --------------------------------
  const stopListening = () => {
    if (listenerRef.current) {
      listenerRef.current();
      listenerRef.current = null;
    }
  };
// --------------------------------
// Create WebRTC Peer Connection
// --------------------------------
const createPeerConnection = (stream) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  });

  peerConnectionRef.current = peerConnection;

  // Add microphone tracks to the WebRTC connection
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });

  return peerConnection;
};
// --------------------------------
// Get Microphone
// --------------------------------
const getMicrophone = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    localStreamRef.current = stream;

    return stream;
  } catch (error) {
    console.error("Microphone access error:", error);

    alert(
      "Microphone access is required for the voice call."
    );

    return null;
  }
};
// --------------------------------
// Create Call Signaling Document
// --------------------------------
const createCallDocument = async (matchId) => {
  try {
    const callRef = doc(db, "calls", matchId);

    await setDoc(
      callRef,
      {
        matchId,
        createdAt: serverTimestamp(),
        status: "waiting",
      },
      { merge: true }
    );

    console.log("📞 Call document created:", matchId);

    return callRef;
  } catch (error) {
    console.error(
      "Error creating call document:",
      error
    );

    return null;
  }
};
  // --------------------------------
  // Find Speaking Partner
  // --------------------------------
  const findSpeakingPartner = async () => {
    try {
      if (!auth.currentUser) {
        alert("Please log in first.");
        return;
      }

      const currentUserId = auth.currentUser.uid;

      console.log("Current user:", currentUserId);

      setIsSearching(true);
      setPartnerFound(false);
      setStatus("🔎 Looking for a speaking partner...");

      // --------------------------------
      // Find another waiting user
      // --------------------------------
      const waitingQuery = query(
        collection(db, "waitingUsers"),
        where("status", "==", "waiting")
      );

      const snapshot = await getDocs(waitingQuery);

      console.log(
        "Waiting users found:",
        snapshot.size
      );

      let partner = null;

      snapshot.forEach((waitingDoc) => {
        const data = waitingDoc.data();

        console.log(
          "Waiting user:",
          waitingDoc.id,
          data
        );

        if (
          data.userId &&
          data.userId !== currentUserId &&
          data.status === "waiting"
        ) {
          partner = {
            id: waitingDoc.id,
            ...data,
          };
        }
      });

      // --------------------------------
      // Partner found
      // --------------------------------
      // --------------------------------
// Partner found
// --------------------------------
if (partner) {
  console.log(
    "🎉 Partner found:",
    partner
  );

  // --------------------------------
  // Create match document FIRST
  // --------------------------------

  const matchRef = await addDoc(
    collection(db, "matches"),
    {
      user1: partner.userId,
      user2: currentUserId,
      status: "matched",
      createdAt: serverTimestamp(),
    }
  );

  const matchId = matchRef.id;

  // Save match ID locally
  matchIdRef.current = matchId;

  console.log(
    "🎉 Match created:",
    matchId
  );

  // --------------------------------
  // Mark partner as matched
  // --------------------------------

  await setDoc(
    doc(db, "waitingUsers", partner.id),
    {
      status: "matched",
      matchedWith: currentUserId,
      matchId: matchId,
      matchedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  console.log(
    "✅ Partner waiting document updated"
  );

  // --------------------------------
  // Create WebRTC call document
  // --------------------------------

  await createCallDocument(matchId);

  // --------------------------------
  // Remove our own waiting document
  // --------------------------------

  if (waitingDocRef.current) {
    await deleteDoc(
      waitingDocRef.current
    );

    waitingDocRef.current = null;
  }

  stopListening();

  setPartnerFound(true);
  setIsSearching(false);
  setStatus(
    "🟢 Speaking partner found!"
  );

  alert(
    "🎉 Speaking partner found!"
  );

  return;
}

      // --------------------------------
      // Nobody waiting
      // --------------------------------

      const waitingRef = doc(
        db,
        "waitingUsers",
        currentUserId
      );

      await setDoc(waitingRef, {
        userId: currentUserId,
        status: "waiting",
        createdAt: serverTimestamp(),
      });

      waitingDocRef.current = waitingRef;

      console.log(
        "🟡 Added to waitingUsers:",
        currentUserId
      );

      setStatus(
        "🟡 Waiting for another learner..."
      );

      // --------------------------------
      // Listen for match
      // --------------------------------

      listenerRef.current = onSnapshot(
        waitingRef,
        async (snapshot) => {
          const data = snapshot.data();

          console.log(
            "Waiting document updated:",
            data
          );

          if (!data) {
            return;
          }

          if (
            data.status === "matched" &&
            data.matchedWith
          ) {
            console.log(
              "🎉 Match received:",
              data
            );
            const matchedUserId = data.matchedWith;

console.log(
  "📌 Matched with user:",
  matchedUserId
);

            stopListening();

            setPartnerFound(true);
            setIsSearching(false);
            setStatus(
              "🟢 Speaking partner found!"
            );

            alert(
              "🎉 Your speaking partner has been found!"
            );

          }
        },
        (error) => {
          console.error(
            "Waiting listener error:",
            error
          );

          setStatus(
            "🔴 Failed to listen for partner"
          );

          setIsSearching(false);
        }
      );
    } catch (error) {
      console.error(
        "❌ Error finding partner:",
        error
      );

      setStatus(
        "🔴 Failed to find a partner"
      );

      setIsSearching(false);

      alert(
        "Failed to find a speaking partner."
      );
    }
  };

  // --------------------------------
  // Cancel Search
  // --------------------------------
  const cancelSearch = async () => {
    try {
      stopListening();

      if (waitingDocRef.current) {
        await deleteDoc(
          waitingDocRef.current
        );

        waitingDocRef.current = null;
      }

      setIsSearching(false);
      setPartnerFound(false);
      setStatus(
        "Ready to find a partner"
      );

      console.log(
        "❌ Search cancelled"
      );
    } catch (error) {
      console.error(
        "Error cancelling search:",
        error
      );
    }
  };

  // --------------------------------
  // Cleanup
  // --------------------------------
  useEffect(() => {
    return () => {
      stopListening();

      if (waitingDocRef.current) {
        deleteDoc(
          waitingDocRef.current
        ).catch((error) => {
          console.error(
            "Cleanup error:",
            error
          );
        });
      }
    };
  }, []);

  // --------------------------------
  // UI
  // --------------------------------
  return (
    <div className="min-h-screen bg-[#f6f0ff] px-6 py-12">

      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold text-violet-700">
            🎲 Random Voice Call
          </h1>

          <p className="mt-3 text-slate-600">
            Find another learner and practice
            English together.
          </p>

        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

          <div className="text-6xl mb-6">
            🎙️
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Find a Speaking Partner
          </h2>

          <p className="text-slate-500 mt-3">
            We'll look for another learner
            who is ready to practice.
          </p>

          {/* Status */}
          <div className="mt-8 bg-violet-50 rounded-2xl p-5">

            <p className="font-semibold text-violet-700">
              {status}
            </p>

          </div>

          {/* Searching */}
          {isSearching && (

            <div className="mt-8">

              <div className="animate-pulse text-violet-600 text-lg">
                🔎 Searching for a learner...
              </div>

              <button
                onClick={cancelSearch}
                className="mt-5 px-6 py-3 rounded-xl border border-red-400 text-red-500 font-semibold hover:bg-red-50 transition"
              >
                Cancel Search
              </button>

            </div>

          )}

          {/* Partner Found */}
          {partnerFound && (

            <div className="mt-8">

              <div className="text-green-600 text-xl font-bold">
                🎉 Partner Found!
              </div>

              <p className="text-slate-500 mt-2">
                Your speaking partner is ready.
              </p>

              <button
                onClick={async () => {
  try {
    const stream = await getMicrophone();

    if (stream) {
      console.log("🎙️ Microphone connected successfully");

      setIsCallActive(true);

      alert("🎙️ Microphone connected successfully!");
    }
  } catch (error) {
    console.error(
      "Microphone error:",
      error
    );

    alert(
      "Could not access your microphone."
    );
  }
}}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-xl font-semibold hover:scale-[1.02] transition"
              >
                🎙️ Start Voice Call
              </button>

            </div>

          )}

          {/* Start Search */}
          {!isSearching && !partnerFound && (

            <button
              onClick={findSpeakingPartner}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-xl font-semibold text-lg hover:scale-[1.02] transition"
            >
              Find a Speaking Partner
            </button>

          )}

        </div>

      </div>

    </div>
  );
}