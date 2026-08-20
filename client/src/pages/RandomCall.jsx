import { useEffect, useRef, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

export default function RandomCall() {
  // --------------------------------
  // UI STATE
  // --------------------------------

  const [status, setStatus] = useState(
    "Ready to find a partner"
  );

  const [isSearching, setIsSearching] =
    useState(false);

  const [partnerFound, setPartnerFound] =
    useState(false);

  const [isCallActive, setIsCallActive] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(false);

  const [connectionRole, setConnectionRole] =
    useState("");

  // --------------------------------
  // WEBRTC REFS
  // --------------------------------

  const localStreamRef = useRef(null);

  const peerConnectionRef =
    useRef(null);

  const remoteAudioRef =
    useRef(null);

  // --------------------------------
  // MATCHING REFS
  // --------------------------------

  const waitingDocRef =
    useRef(null);

  const waitingListenerRef =
    useRef(null);

  const matchIdRef =
    useRef(null);

  // --------------------------------
  // CALL LISTENER REFS
  // --------------------------------

  const callListenerRef =
    useRef(null);

  const callerCandidatesListenerRef =
    useRef(null);

  const calleeCandidatesListenerRef =
    useRef(null);

  // --------------------------------
  // PENDING ICE CANDIDATES
  // --------------------------------

  const pendingCandidatesRef =
    useRef([]);

  // --------------------------------
  // STOP MATCH LISTENER
  // --------------------------------

  const stopWaitingListener = () => {
    if (waitingListenerRef.current) {
      waitingListenerRef.current();
      waitingListenerRef.current = null;
    }
  };

  // --------------------------------
  // STOP CALL LISTENERS
  // --------------------------------

  const stopCallListeners = () => {
    if (callListenerRef.current) {
      callListenerRef.current();
      callListenerRef.current = null;
    }

    if (callerCandidatesListenerRef.current) {
      callerCandidatesListenerRef.current();
      callerCandidatesListenerRef.current = null;
    }

    if (calleeCandidatesListenerRef.current) {
      calleeCandidatesListenerRef.current();
      calleeCandidatesListenerRef.current = null;
    }
  };

  // --------------------------------
  // GET MICROPHONE
  // --------------------------------

  const getMicrophone = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        });

      localStreamRef.current = stream;

      console.log(
        "🎙️ Microphone connected successfully"
      );

      return stream;
    } catch (error) {
      console.error(
        "❌ Microphone access error:",
        error
      );

      alert(
        "Microphone access is required for the voice call."
      );

      return null;
    }
  };

  // --------------------------------
  // CREATE WEBRTC PEER CONNECTION
  // --------------------------------

  const createPeerConnection = (
    stream,
    matchId
  ) => {
    console.log(
      "🔗 Creating WebRTC peer connection..."
    );

    const peerConnection =
      new RTCPeerConnection({
        iceServers: [
          {
            urls:
              "stun:stun.l.google.com:19302",
          },
        ],
      });

    peerConnectionRef.current =
      peerConnection;
      stream.getTracks().forEach((track) => {
  peerConnection.addTrack(track, stream);
});
      // Store the match ID for WebRTC signaling
matchIdRef.current = matchId;
console.log(
  "🎙️ Local audio tracks added to WebRTC connection"
);
console.log(
  "✅ WebRTC peer connection created for match:",
  matchId
);

    

    // --------------------------------
    // RECEIVE REMOTE AUDIO
    // --------------------------------

    peerConnection.ontrack = (event) => {
      console.log(
        "🔊 Remote audio received"
      );

      if (
        remoteAudioRef.current &&
        event.streams[0]
      ) {
        remoteAudioRef.current.srcObject =
          event.streams[0];

        remoteAudioRef.current
          .play()
          .then(() => {
            console.log(
              "🔊 Remote audio playing"
            );
          })
          .catch((error) => {
            console.log(
              "Audio playback waiting for user interaction:",
              error
            );
          });
      }
    };

    // --------------------------------
    // CONNECTION STATE
    // --------------------------------

    peerConnection.onconnectionstatechange =
      () => {
        console.log(
          "WebRTC connection state:",
          peerConnection.connectionState
        );

        if (
          peerConnection.connectionState ===
          "connected"
        ) {
          setStatus("🟢 Call connected");
          setIsCallActive(true);
        }

        if (
          peerConnection.connectionState ===
          "connecting"
        ) {
          setStatus(
            "🟡 Connecting voice call..."
          );
        }

        if (
          peerConnection.connectionState ===
            "disconnected" ||
          peerConnection.connectionState ===
            "failed"
        ) {
          setStatus(
            "🔴 Voice connection lost"
          );
        }

        if (
          peerConnection.connectionState ===
          "closed"
        ) {
          setStatus(
            "Call ended"
          );
        }
      };

    // --------------------------------
    // ICE CONNECTION STATE
    // --------------------------------

    peerConnection.oniceconnectionstatechange =
      () => {
        console.log(
          "ICE connection state:",
          peerConnection.iceConnectionState
        );
      };

    console.log(
      "✅ WebRTC peer connection created:",
      peerConnection
    );

    return peerConnection;
  };

  // --------------------------------
  // ADD ICE CANDIDATE SAFELY
  // --------------------------------

  const addIceCandidateSafely =
    async (candidate) => {
      const peerConnection =
        peerConnectionRef.current;

      if (!peerConnection) {
        return;
      }

      // If remote description isn't ready,
      // save candidate temporarily.
      if (
        !peerConnection.remoteDescription
      ) {
        pendingCandidatesRef.current.push(
          candidate
        );

        console.log(
          "⏳ ICE candidate queued"
        );

        return;
      }

      try {
        await peerConnection.addIceCandidate(
          candidate
        );

        console.log(
          "🧊 ICE candidate added"
        );
      } catch (error) {
        console.error(
          "❌ Error adding ICE candidate:",
          error
        );
      }
    };

  // --------------------------------
  // ADD PENDING ICE CANDIDATES
  // --------------------------------

  const addPendingCandidates = async () => {
    const peerConnection =
      peerConnectionRef.current;

    if (!peerConnection) {
      return;
    }

    const candidates =
      pendingCandidatesRef.current;

    pendingCandidatesRef.current = [];

    for (const candidate of candidates) {
      try {
        await peerConnection.addIceCandidate(
          candidate
        );

        console.log(
          "🧊 Pending ICE candidate added"
        );
      } catch (error) {
        console.error(
          "❌ Error adding pending candidate:",
          error
        );
      }
    }
  };

  // --------------------------------
  // CALLER
  // --------------------------------

  const startCaller = async (
    matchId
  ) => {
    console.log(
      "📞 Starting caller..."
    );

    setConnectionRole(
      "📞 You are the caller"
    );

    setStatus(
      "🎙️ Starting microphone..."
    );

    const stream =
      await getMicrophone();

    if (!stream) {
      return;
    }

    const peerConnection =
      createPeerConnection(
        stream,
        matchId
      );

    const callRef = doc(
      db,
      "calls",
      matchId
    );

    // --------------------------------
    // CALLER ICE CANDIDATES
    // --------------------------------

    const callerCandidatesRef =
      collection(
        callRef,
        "callerCandidates"
      );

    peerConnection.onicecandidate =
      async (event) => {
        if (!event.candidate) {
          return;
        }

        try {
          await addDoc(
            callerCandidatesRef,
            event.candidate.toJSON()
          );

          console.log(
            "🧊 Caller ICE candidate saved"
          );
        } catch (error) {
          console.error(
            "❌ Error saving caller ICE candidate:",
            error
          );
        }
      };

    // --------------------------------
    // LISTEN FOR ANSWER
    // --------------------------------

    callListenerRef.current =
      onSnapshot(
        callRef,
        async (snapshot) => {
          const data =
            snapshot.data();

          if (!data) {
            return;
          }

          // Answer received
          if (
            data.answer &&
            !peerConnection
              .currentRemoteDescription
          ) {
            console.log(
              "📥 Answer received"
            );

            try {
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(
                  data.answer
                )
              );

              console.log(
                "✅ Remote answer set"
              );

              await addPendingCandidates();
            } catch (error) {
              console.error(
                "❌ Error setting remote answer:",
                error
              );
            }
          }
        },
        (error) => {
          console.error(
            "❌ Call listener error:",
            error
          );
        }
      );

    // --------------------------------
    // LISTEN FOR CALLEE ICE
    // --------------------------------

    const calleeCandidatesRef =
      collection(
        callRef,
        "calleeCandidates"
      );

    calleeCandidatesListenerRef.current =
      onSnapshot(
        calleeCandidatesRef,
        (snapshot) => {
          snapshot.docChanges().forEach(
            (change) => {
              if (
                change.type !==
                "added"
              ) {
                return;
              }

              const candidate =
                new RTCIceCandidate(
                  change.doc.data()
                );

              addIceCandidateSafely(
                candidate
              );
            }
          );
        }
      );

    // --------------------------------
    // CREATE OFFER
    // --------------------------------

    console.log(
      "📤 Creating WebRTC offer..."
    );

    const offer =
      await peerConnection.createOffer();

    await peerConnection.setLocalDescription(
      offer
    );

    console.log(
      "📤 Offer created"
    );

    // --------------------------------
    // CREATE CALL DOCUMENT
    // --------------------------------
    // IMPORTANT:
    // This happens AFTER the peer
    // connection exists.

    await setDoc(
      callRef,
      {
        matchId,
        callerId:
          auth.currentUser.uid,
        status:
          "offer-created",
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
        createdAt:
          serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    console.log(
      "📞 Call document + offer created:",
      matchId
    );

    setStatus(
      "🟡 Waiting for partner to answer..."
    );
  };

  // --------------------------------
  // CALLEE
  // --------------------------------

  const startCallee = async (
    matchId
  ) => {
    console.log(
      "📞 Starting callee..."
    );

    setConnectionRole(
      "📥 You are the receiver"
    );

    setStatus(
      "🎙️ Starting microphone..."
    );

    const stream =
      await getMicrophone();

    if (!stream) {
      return;
    }

    const peerConnection =
      createPeerConnection(
        stream,
        matchId
      );

    const callRef = doc(
      db,
      "calls",
      matchId
    );

    // --------------------------------
    // CALLEE ICE CANDIDATES
    // --------------------------------

    const calleeCandidatesRef =
      collection(
        callRef,
        "calleeCandidates"
      );

    peerConnection.onicecandidate =
      async (event) => {
        if (!event.candidate) {
          return;
        }

        try {
          await addDoc(
            calleeCandidatesRef,
            event.candidate.toJSON()
          );

          console.log(
            "🧊 Callee ICE candidate saved"
          );
        } catch (error) {
          console.error(
            "❌ Error saving callee ICE candidate:",
            error
          );
        }
      };

    // --------------------------------
    // LISTEN FOR CALL / OFFER
    // --------------------------------

    callListenerRef.current =
      onSnapshot(
        callRef,
        async (snapshot) => {
          const data =
            snapshot.data();

          if (!data) {
            console.log(
              "⏳ Waiting for caller..."
            );

            return;
          }

          // --------------------------------
          // OFFER RECEIVED
          // --------------------------------

          if (
            data.offer &&
            !peerConnection
              .currentRemoteDescription
          ) {
            console.log(
              "📥 Offer received"
            );

            try {
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(
                  data.offer
                )
              );

              console.log(
                "✅ Remote offer set"
              );

              await addPendingCandidates();

              // --------------------------------
              // CREATE ANSWER
              // --------------------------------

              console.log(
                "📤 Creating answer..."
              );

              const answer =
                await peerConnection.createAnswer();

              await peerConnection.setLocalDescription(
                answer
              );

              console.log(
                "📤 Answer created"
              );

              await setDoc(
                callRef,
                {
                  calleeId:
                    auth.currentUser.uid,
                  status:
                    "answer-created",
                  answer: {
                    type:
                      answer.type,
                    sdp:
                      answer.sdp,
                  },
                },
                {
                  merge: true,
                }
              );

              console.log(
                "📞 Answer saved to Firestore"
              );

              setStatus(
                "🟡 Connecting voice call..."
              );
            } catch (error) {
              console.error(
                "❌ Error handling offer:",
                error
              );
            }
          }
        },
        (error) => {
          console.error(
            "❌ Call listener error:",
            error
          );
        }
      );

    // --------------------------------
    // LISTEN FOR CALLER ICE
    // --------------------------------

    const callerCandidatesRef =
      collection(
        callRef,
        "callerCandidates"
      );

    callerCandidatesListenerRef.current =
      onSnapshot(
        callerCandidatesRef,
        (snapshot) => {
          snapshot.docChanges().forEach(
            (change) => {
              if (
                change.type !==
                "added"
              ) {
                return;
              }

              const candidate =
                new RTCIceCandidate(
                  change.doc.data()
                );

              addIceCandidateSafely(
                candidate
              );
            }
          );
        }
      );

    setStatus(
      "🟡 Waiting for caller..."
    );
  };

  // --------------------------------
  // START VOICE CALL
  // --------------------------------

  const startVoiceCall = async () => {
    try {
      if (!auth.currentUser) {
        alert(
          "Please log in first."
        );

        return;
      }

      const matchId =
        matchIdRef.current;

      if (!matchId) {
        alert(
          "Match information is missing. Please find a partner again."
        );

        return;
      }

      // Prevent duplicate calls
      if (
        peerConnectionRef.current
      ) {
        console.log(
          "WebRTC connection already exists"
        );

        return;
      }

      console.log(
        "🚀 Starting voice call for match:",
        matchId
      );

      setStatus(
        "🔄 Preparing voice call..."
      );

      // --------------------------------
      // GET MATCH DOCUMENT
      // --------------------------------

      const matchRef = doc(
        db,
        "matches",
        matchId
      );

      const matchSnapshot =
        await getDoc(matchRef);

      if (!matchSnapshot.exists()) {
        alert(
          "Match no longer exists."
        );

        return;
      }

      const match =
        matchSnapshot.data();

      const currentUserId =
        auth.currentUser.uid;

      // --------------------------------
      // DETERMINE ROLE
      // --------------------------------

      if (
        currentUserId ===
        match.user2
      ) {
        // User who found the waiting
        // partner becomes caller.
        await startCaller(
          matchId
        );
      } else if (
        currentUserId ===
        match.user1
      ) {
        // Waiting user becomes callee.
        await startCallee(
          matchId
        );
      } else {
        console.error(
          "Current user is not part of this match."
        );

        alert(
          "You are not part of this match."
        );
      }
    } catch (error) {
      console.error(
        "❌ Error starting voice call:",
        error
      );

      setStatus(
        "🔴 Failed to start voice call"
      );

      alert(
        "Failed to start the voice call. Check the console."
      );
    }
  };

  // --------------------------------
  // FIND SPEAKING PARTNER
  // --------------------------------

  const findSpeakingPartner =
    async () => {
      try {
        if (!auth.currentUser) {
          alert(
            "Please log in first."
          );

          return;
        }

        const currentUserId =
          auth.currentUser.uid;

        console.log(
          "👤 Current user:",
          currentUserId
        );

        setIsSearching(true);
        setPartnerFound(false);
        setStatus(
          "🔎 Looking for a speaking partner..."
        );

        // --------------------------------
        // FIND WAITING USER
        // --------------------------------

        const waitingQuery =
          query(
            collection(
              db,
              "waitingUsers"
            ),
            where(
              "status",
              "==",
              "waiting"
            )
          );

        const snapshot =
          await getDocs(
            waitingQuery
          );

        console.log(
          "Waiting users found:",
          snapshot.size
        );

        let partner = null;

        snapshot.forEach(
          (waitingDoc) => {
            const data =
              waitingDoc.data();

            console.log(
              "Waiting user:",
              waitingDoc.id,
              data
            );

            if (
              !partner &&
              data.userId &&
              data.userId !==
                currentUserId &&
              data.status ===
                "waiting"
            ) {
              partner = {
                id: waitingDoc.id,
                ...data,
              };
            }
          }
        );

        // --------------------------------
        // PARTNER FOUND
        // --------------------------------

        if (partner) {
          console.log(
            "🎉 Partner found:",
            partner
          );

          // --------------------------------
          // CREATE MATCH
          // --------------------------------

          const matchRef =
            await addDoc(
              collection(
                db,
                "matches"
              ),
              {
                user1:
                  partner.userId,

                user2:
                  currentUserId,

                status:
                  "matched",

                createdAt:
                  serverTimestamp(),
              }
            );

          const matchId =
            matchRef.id;

          matchIdRef.current =
            matchId;

          console.log(
            "🎉 Match created:",
            matchId
          );

          // --------------------------------
          // UPDATE PARTNER WAITING DOC
          // --------------------------------

          await setDoc(
            doc(
              db,
              "waitingUsers",
              partner.id
            ),
            {
              status:
                "matched",

              matchedWith:
                currentUserId,

              matchId:

                matchId,

              matchedAt:
                serverTimestamp(),
            },
            {
              merge: true,
            }
          );

          console.log(
            "✅ Partner waiting document updated"
          );

          // --------------------------------
          // DO NOT CREATE CALL HERE
          // --------------------------------
          //
          // The caller will create the
          // call document when Start
          // Voice Call is clicked.

          // --------------------------------
          // REMOVE OWN WAITING DOC
          // --------------------------------

          if (
            waitingDocRef.current
          ) {
            await deleteDoc(
              waitingDocRef.current
            );

            waitingDocRef.current =
              null;
          }

          stopWaitingListener();

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
        // NO PARTNER FOUND
        // --------------------------------

        const waitingRef =
          doc(
            db,
            "waitingUsers",
            currentUserId
          );

        await setDoc(
          waitingRef,
          {
            userId:
              currentUserId,

            status:
              "waiting",

            createdAt:
              serverTimestamp(),
          }
        );

        waitingDocRef.current =
          waitingRef;

        console.log(
          "🟡 Added to waitingUsers:",
          currentUserId
        );

        setStatus(
          "🟡 Waiting for another learner..."
        );

        // --------------------------------
        // LISTEN FOR MATCH
        // --------------------------------

        waitingListenerRef.current =
          onSnapshot(
            waitingRef,
            async (snapshot) => {
              const data =
                snapshot.data();

              console.log(
                "Waiting document updated:",
                data
              );

              if (!data) {
                return;
              }

              if (
                data.status ===
                  "matched" &&
                data.matchedWith &&
                data.matchId
              ) {
                console.log(
                  "🎉 Match received:",
                  data
                );

                matchIdRef.current =
                  data.matchId;

                stopWaitingListener();

                setPartnerFound(
                  true
                );

                setIsSearching(
                  false
                );

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
                "❌ Waiting listener error:",
                error
              );

              setStatus(
                "🔴 Failed to listen for partner"
              );

              setIsSearching(
                false
              );
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
  // END VOICE CALL
  // --------------------------------

  const endVoiceCall = async () => {
    try {
      console.log(
        "📴 Ending voice call..."
      );

      stopCallListeners();

      // Stop microphone
      if (
        localStreamRef.current
      ) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

        localStreamRef.current =
          null;
      }

      // Close peer connection
      if (
        peerConnectionRef.current
      ) {
        peerConnectionRef.current.close();

        peerConnectionRef.current =
          null;
      }

      // Remove remote audio
      if (
        remoteAudioRef.current
      ) {
        remoteAudioRef.current.srcObject =
          null;
      }

      pendingCandidatesRef.current =
        [];

      setIsCallActive(false);
      setIsMuted(false);

      setStatus(
        "📴 Call ended"
      );

      console.log(
        "✅ Voice call ended"
      );
    } catch (error) {
      console.error(
        "❌ Error ending call:",
        error
      );
    }
  };

  // --------------------------------
  // MUTE / UNMUTE
  // --------------------------------

  const toggleMute = () => {
    if (
      !localStreamRef.current
    ) {
      return;
    }

    const audioTracks =
      localStreamRef.current.getAudioTracks();

    audioTracks.forEach(
      (track) => {
        track.enabled =
          !track.enabled;
      }
    );

    setIsMuted(
      !isMuted
    );

    console.log(
      !isMuted
        ? "🔇 Microphone muted"
        : "🎙️ Microphone unmuted"
    );
  };

  // --------------------------------
  // CANCEL SEARCH
  // --------------------------------

  const cancelSearch =
    async () => {
      try {
        stopWaitingListener();

        if (
          waitingDocRef.current
        ) {
          await deleteDoc(
            waitingDocRef.current
          );

          waitingDocRef.current =
            null;
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
          "❌ Error cancelling search:",
          error
        );
      }
    };

  // --------------------------------
  // CLEANUP WHEN PAGE CLOSES
  // --------------------------------

  useEffect(() => {
    return () => {
      stopWaitingListener();
      stopCallListeners();

      if (
        waitingDocRef.current
      ) {
        deleteDoc(
          waitingDocRef.current
        ).catch((error) => {
          console.error(
            "Cleanup error:",
            error
          );
        });
      }

      if (
        localStreamRef.current
      ) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      if (
        peerConnectionRef.current
      ) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="min-h-screen bg-[#f6f0ff] px-6 py-12">

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold text-violet-700">
            🎲 Random Voice Call
          </h1>

          <p className="mt-3 text-slate-600">
            Find another learner and practice
            English together.
          </p>

        </div>

        {/* MAIN CARD */}

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

          {/* STATUS */}

          <div className="mt-8 bg-violet-50 rounded-2xl p-5">

            <p className="font-semibold text-violet-700">
              {status}
            </p>

            {connectionRole && (
              <p className="text-sm text-slate-500 mt-2">
                {connectionRole}
              </p>
            )}

          </div>

          {/* SEARCHING */}

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

          {/* PARTNER FOUND */}

          {partnerFound &&
            !isCallActive && (
              <div className="mt-8">

                <div className="text-green-600 text-xl font-bold">
                  🎉 Partner Found!
                </div>

                <p className="text-slate-500 mt-2">
                  Your speaking partner is ready.
                </p>

                <button
                  onClick={
                    startVoiceCall
                  }
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-xl font-semibold hover:scale-[1.02] transition"
                >
                  🎙️ Start Voice Call
                </button>

              </div>
            )}

          {/* ACTIVE CALL */}

          {isCallActive && (
            <div className="mt-8">

              <div className="text-green-600 text-2xl font-bold">
                🟢 Voice Call Active
              </div>

              <p className="text-slate-500 mt-3">
                You are connected with your
                speaking partner.
              </p>

              <div className="flex justify-center gap-4 mt-6">

                <button
                  onClick={
                    toggleMute
                  }
                  className={`px-6 py-3 rounded-xl font-semibold ${
                    isMuted
                      ? "bg-red-500 text-white"
                      : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {isMuted
                    ? "🔇 Unmute"
                    : "🎙️ Mute"}
                </button>

                <button
                  onClick={
                    endVoiceCall
                  }
                  className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  📴 End Call
                </button>

              </div>

            </div>
          )}

          {/* START SEARCH */}

          {!isSearching &&
            !partnerFound &&
            !isCallActive && (
              <button
                onClick={
                  findSpeakingPartner
                }
                className="mt-8 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-xl font-semibold text-lg hover:scale-[1.02] transition"
              >
                Find a Speaking Partner
              </button>
            )}

        </div>

        {/* REMOTE AUDIO */}

        <audio
          ref={remoteAudioRef}
          autoPlay
          playsInline
        />

      </div>

    </div>
  );
}