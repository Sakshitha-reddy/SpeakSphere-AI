import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

export default function VoiceRooms() {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState("Not connected");
  const [connectionRole, setConnectionRole] = useState("");

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const candidateUnsubscribersRef = useRef([]);
  const roomUnsubscriberRef = useRef(null);

  const servers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  // -----------------------------
  // Get microphone
  // -----------------------------
  const getMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: false,
});

      localStreamRef.current = stream;

      return stream;
    } catch (error) {
      console.error("Microphone error:", error);
      alert(
        "Microphone access was denied. Please allow microphone permission and try again."
      );

      return null;
    }
  };

  // -----------------------------
  // Create WebRTC connection
  // -----------------------------
  const createPeerConnection = async () => {
    const peerConnection = new RTCPeerConnection(servers);

    peerConnectionRef.current = peerConnection;

    peerConnection.onconnectionstatechange = () => {
      console.log(
        "Connection state:",
        peerConnection.connectionState
      );

      if (peerConnection.connectionState === "connected") {
        setStatus("🟢 Connected");
      }

      if (
        peerConnection.connectionState === "disconnected" ||
        peerConnection.connectionState === "failed"
      ) {
        setStatus("🔴 Connection lost");
      }
    };

    peerConnection.ontrack = (event) => {
      console.log("Remote audio received");

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];

        remoteAudioRef.current
          .play()
          .catch((error) => {
            console.log("Audio playback waiting for user interaction:", error);
          });
      }
    };

    const stream = localStreamRef.current || (await getMicrophone());

    if (!stream) {
      peerConnection.close();
      return null;
    }

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    return peerConnection;
  };

  // -----------------------------
  // Create Room
  // -----------------------------
  const createRoom = async () => {
    if (!roomName.trim()) {
      alert("Please enter a room name.");
      return;
    }

    try {
      setStatus("🎙️ Starting microphone...");

      const stream = await getMicrophone();

      if (!stream) {
        return;
      }

      const roomRef = await addDoc(collection(db, "rooms"), {
        name: roomName.trim(),
        createdBy: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp(),
        status: "waiting",
      });

      setRoomId(roomRef.id);
setIsInRoom(true);
setConnectionRole("👤 You are the room creator");
setStatus("🟡 Waiting for another learner...");

      const peerConnection = await createPeerConnection();

      if (!peerConnection) {
        return;
      }

      // Caller ICE candidates
      const callerCandidatesCollection = collection(
        roomRef,
        "callerCandidates"
      );

      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          await addDoc(callerCandidatesCollection, event.candidate.toJSON());
        }
      };

      // Create offer
      const offerDescription = await peerConnection.createOffer();

      await peerConnection.setLocalDescription(offerDescription);

      await setDoc(
        roomRef,
        {
          offer: {
            type: offerDescription.type,
            sdp: offerDescription.sdp,
          },
        },
        { merge: true }
      );

      // Listen for answer
      roomUnsubscriberRef.current = onSnapshot(
        roomRef,
        async (snapshot) => {
          const data = snapshot.data();

          if (!data) {
            return;
          }

          if (
            data.answer &&
            !peerConnection.currentRemoteDescription
          ) {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );

            setStatus("🟢 Connected");
          }
        }
      );

      // Listen for callee ICE candidates
      const calleeCandidatesCollection = collection(
        roomRef,
        "calleeCandidates"
      );

      const unsubscribeCandidates = onSnapshot(
        calleeCandidatesCollection,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const candidate = new RTCIceCandidate(change.doc.data());

              peerConnection
                .addIceCandidate(candidate)
                .catch((error) =>
                  console.error("Error adding candidate:", error)
                );
            }
          });
        }
      );

      candidateUnsubscribersRef.current.push(
        unsubscribeCandidates
      );

      alert(
        `Room created!\n\nRoom ID:\n${roomRef.id}\n\nShare this ID with the person you want to practice with.`
      );
    } catch (error) {
      console.error("Error creating room:", error);
      setStatus("🔴 Failed to create room");
      alert("Failed to create room. Check the browser console.");
    }
  };
    // -----------------------------
  // Join Room
  // -----------------------------
  const joinRoom = async () => {
    if (!roomId.trim()) {
      alert("Please enter a room ID.");
      return;
    }

    try {
      setStatus("🎙️ Starting microphone...");

      const roomRef = doc(db, "rooms", roomId.trim());
      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists()) {
        alert("Room not found. Please check the Room ID.");
        return;
      }

      const roomData = roomSnapshot.data();

      if (roomData.createdBy === auth.currentUser?.uid) {
        alert("You cannot join your own room.");
        return;
      }

      if (!roomData.offer) {
        alert("This room is not ready yet. Please try again.");
        return;
      }

      const stream = await getMicrophone();

      if (!stream) {
        return;
      }

     setIsInRoom(true);
setConnectionRole("👤 You joined this room");
setStatus("🔄 Connecting...");

      const peerConnection = await createPeerConnection();

      if (!peerConnection) {
        return;
      }

      // Callee ICE candidates
      const calleeCandidatesCollection = collection(
        roomRef,
        "calleeCandidates"
      );

      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          await addDoc(
            calleeCandidatesCollection,
            event.candidate.toJSON()
          );
        }
      };

      // Set caller's offer
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(roomData.offer)
      );

      // Create answer
      const answerDescription =
        await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(answerDescription);

      await setDoc(
        roomRef,
        {
          answer: {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
          },
          joinedBy: auth.currentUser?.uid || "anonymous",
          status: "connected",
        },
        { merge: true }
      );

      // Listen for caller ICE candidates
      const callerCandidatesCollection = collection(
        roomRef,
        "callerCandidates"
      );

      const unsubscribeCandidates = onSnapshot(
        callerCandidatesCollection,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const candidate = new RTCIceCandidate(change.doc.data());

              peerConnection
                .addIceCandidate(candidate)
                .catch((error) =>
                  console.error("Error adding candidate:", error)
                );
            }
          });
        }
      );

      candidateUnsubscribersRef.current.push(
        unsubscribeCandidates
      );
    } catch (error) {
      console.error("Error joining room:", error);
      setStatus("🔴 Failed to join room");
      alert("Failed to join room. Check the browser console.");
    }
  };

  // -----------------------------
  // Mute / Unmute
  // -----------------------------
  const toggleMute = () => {
    const stream = localStreamRef.current;

    if (!stream) {
      return;
    }

    const audioTrack = stream.getAudioTracks()[0];

    if (!audioTrack) {
      return;
    }

    audioTrack.enabled = !audioTrack.enabled;

    setIsMuted(!audioTrack.enabled);
  };

  // -----------------------------
  // Leave Room
  // -----------------------------
  const leaveRoom = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    if (roomUnsubscriberRef.current) {
      roomUnsubscriberRef.current();
      roomUnsubscriberRef.current = null;
    }

    candidateUnsubscribersRef.current.forEach(
      (unsubscribe) => unsubscribe()
    );

    candidateUnsubscribersRef.current = [];

    setIsInRoom(false);
setIsMuted(false);
setStatus("Not connected");
setConnectionRole("");
  };

  // -----------------------------
  // Cleanup when page closes
  // -----------------------------
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      if (roomUnsubscriberRef.current) {
        roomUnsubscriberRef.current();
      }

      candidateUnsubscribersRef.current.forEach(
        (unsubscribe) => unsubscribe()
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f0ff] px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">

          <h1 className="text-4xl md:text-5xl font-bold text-violet-700">
            🗣️ Live Voice Rooms
          </h1>

          <p className="mt-3 text-slate-600 text-lg">
            Practice English with other learners through live
            voice conversations.
          </p>

        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-8 text-center">

  <p className="text-sm text-slate-500">
    Connection Status
  </p>

  <p className="text-lg font-semibold text-slate-800 mt-1">
    {status}
  </p>

  {connectionRole && (
    <p className="text-sm text-violet-600 font-medium mt-2">
      {connectionRole}
    </p>
  )}

</div>

        {/* Create / Join */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Create Room */}
          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-slate-900">
              Create a Room
            </h2>

            <p className="text-slate-500 mt-2">
              Start a private voice room and invite another learner.
            </p>

            <input
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              disabled={isInRoom}
              className="w-full mt-6 px-4 py-3 rounded-xl border border-violet-200 outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-slate-100"
            />

            <button
              onClick={createRoom}
              disabled={isInRoom}
              className="w-full mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition disabled:opacity-50 disabled:hover:scale-100"
            >
              Create Voice Room
            </button>

          </div>

          {/* Join Room */}
          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-slate-900">
              Join a Room
            </h2>

            <p className="text-slate-500 mt-2">
              Enter a room ID shared by another learner.
            </p>

            <input
              type="text"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={isInRoom}
              className="w-full mt-6 px-4 py-3 rounded-xl border border-violet-200 outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-slate-100"
            />

            <button
              onClick={joinRoom}
              disabled={isInRoom}
              className="w-full mt-4 border border-violet-500 text-violet-700 py-3 rounded-xl font-semibold hover:bg-violet-50 transition disabled:opacity-50"
            >
              Join Voice Room
            </button>

          </div>

        </div>

        {/* Room Information */}
        {roomId && (
          <div className="bg-white rounded-3xl shadow-lg p-8 mt-8 text-center">

            <h2 className="text-xl font-bold text-slate-900">
              Your Room ID
            </h2>

            <p className="mt-3 text-2xl font-mono font-bold text-violet-700 break-all">
              {roomId}
            </p>

            <p className="text-sm text-slate-500 mt-3">
              Share this ID with another learner to let them join.
            </p>

          </div>
        )}

        {/* Voice Controls */}
        {isInRoom && (
          <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

            <h2 className="text-2xl font-bold text-center text-slate-900">
              🎙️ Voice Call
            </h2>

            <p className="text-center text-slate-500 mt-2">
              You are in the voice room.
            </p>

            <div className="flex justify-center gap-4 mt-6">

              <button
                onClick={toggleMute}
                className="px-6 py-3 rounded-xl bg-violet-100 text-violet-700 font-semibold hover:bg-violet-200 transition"
              >
                {isMuted ? "🔇 Unmute" : "🎙️ Mute"}
              </button>

              <button
                onClick={leaveRoom}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                📞 Leave Room
              </button>

            </div>

          </div>
        )}

        {/* Hidden remote audio */}
        <audio
          ref={remoteAudioRef}
          autoPlay
          playsInline
        />

      </div>
    </div>
  );
}