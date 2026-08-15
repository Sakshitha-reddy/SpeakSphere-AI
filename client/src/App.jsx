import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import Practice from "./pages/Practice";
import Vocabulary from "./pages/Vocabulary";
import VoiceRooms from "./pages/VoiceRooms";
import RandomCall from "./pages/RandomCall";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <Practice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vocabulary"
        element={
          <ProtectedRoute>
            <Vocabulary />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <VoiceRooms />
          </ProtectedRoute>
        }
      />
      <Route
  path="/random-call"
  element={
    <ProtectedRoute>
      <RandomCall />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;