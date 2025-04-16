import React, { useState } from "react";
import background from "../assets/Chessbackground.png";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "./backend/firebase-config";
import { firestore } from "./backend/firebase-config";
import {
  getDocs,
  getDoc,
  doc,
  query,
  where,
  collection,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";

function Login({}) {
  //States
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //Functions
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (emailError) setEmailError(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(false);
  };

  const handleForgotPassword = async () => {
    setEmailError(false);

    if (!username) {
      setEmailError(true);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, username);
    } catch (error) {
      alert("Error sending password reset email: " + error.message);
    }
  };

  const fetchDetails = async () => {
    try {
      const storedData = localStorage.getItem("data");

      const parsedData = JSON.parse(storedData);
      const q = query(
        collection(firestore, "transactions"),
        where("email", "==", parsedData.email)
      );
      const querySnapshot = await getDocs(q);
      const categories = querySnapshot.docs
        .map((doc) => doc.data().category?.trim())
        .filter((category) => category && category !== "");

      localStorage.setItem("transactions", categories);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      const userRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        var data = docSnap.data();
        localStorage.setItem("login", "true");
        localStorage.setItem("type", data.type);
        localStorage.setItem("data", JSON.stringify(data));
        sessionStorage.setItem("registered", "true");
        fetchDetails();
        setTimeout(() => {
          window.dispatchEvent(new Event("storage"));
          if (data.type === "Admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 100);
      } else {
        setLoginError("User Not Exists");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async () => {
    setEmailError(false);
    setPasswordError(false);
    setLoginError("");

    if (!username) {
      setEmailError(true);
      return;
    }

    if (!password) {
      setPasswordError(true);
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;
      const userRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem("login", "true");
        localStorage.setItem("type", data.type);
        localStorage.setItem("data", JSON.stringify(data));
        sessionStorage.setItem("registered", "true");

        fetchDetails();

        setTimeout(() => {
          window.dispatchEvent(new Event("storage"));
          setIsLoading(false);
          if (data.type === "Admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 100);
      } else {
        setIsLoading(false);
        setLoginError("User does not exist.");
      }
    } catch (error) {
      setIsLoading(false);
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div
      className="flex font-bebas-neue items-center justify-center h-screen bg-cover bg-fixed bg-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "darken",
      }}
    >
      <div className="px-4 py-10 mx-5 w-full max-w-md bg-black border border-white shadow-lg rounded-xl">
        <h1 className="text-4xl pb-10 text-orange-500 font-semibold text-center">
          Login
        </h1>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={handleUsernameChange}
          className={`w-full p-2 mb-4 border rounded ${
            emailError
              ? "border-2 border-red-500 font-bold text-red-500 placeholder-red-500"
              : ""
          }`}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className={`w-full p-2 mb-4 border rounded ${
            passwordError
              ? "border-2 border-red-500 font-bold text-red-500 placeholder-red-500"
              : ""
          }`}
          disabled={isLoading}
        />

        <div className="mt-4 flex justify-between text-sm text-white">
          <button onClick={handleForgotPassword} className="hover:underline">
            Forgot Password
          </button>
          <button
            onClick={() => navigate("/register")}
            className="hover:underline"
          >
            Create an Account
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-cyan-500 text-white rounded hover:bg-blue-500 hover:text-black"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4"
        >
          Login with Google
        </button>
        <div className="text-white mt-3 underline hover:text-blue-600 hover:cursor-pointer">
          {" "}
          <span onClick={() => navigate("/")}>Back To Home</span>
        </div>
        {loginError && (
          <div className="text-red-500 text-sm text-center mt-2">
            {loginError}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
