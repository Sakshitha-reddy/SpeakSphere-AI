import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC33_uKRdfQYBYZJ3b1bfCfuRP-TIEuE2o",
  authDomain: "speaksphere-88f4a.firebaseapp.com",
  projectId: "speaksphere-88f4a",
  storageBucket: "speaksphere-88f4a.firebasestorage.app",
  messagingSenderId: "435171281510",
  appId: "1:435171281510:web:5b4153ca64d1e9d2873ba7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;