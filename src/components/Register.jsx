import React, { useState, useEffect } from "react";
import background from "../assets/Chessbackground.png";
import { useNavigate, useLocation } from "react-router-dom";
import {
  auth,
  googleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "./backend/firebase-config";
import { firestore } from "./backend/firebase-config";
import { setDoc, doc } from "firebase/firestore";

function Register() {
  //States
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [lichess, setLichess] = useState("");
  const [gender, setGender] = useState("");
  const [district, setDistrict] = useState("");
  // const [fide, setFide] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  //Functions
  useEffect(() => {
    if (location.state) {
      setName(location.state.name || "");
      setEmail(location.state.email || "");
      setIsGoogleSignIn(location.state.isGoogleSignIn || false);
    }
  }, [location.state]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      setName(user.displayName);
      setEmail(user.email);
      setIsGoogleSignIn(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      await storeUserData(uid);
      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      alert(error.message);
    }
  };

  const storeUserData = async (uid) => {
    try {
      const userRef = doc(firestore, "users", uid);
      await setDoc(userRef, {
        name,
        email,
        mobile,
        lichess,
        // fide,
        gender,
        district,
        type: "Student",
        isGoogleSignIn,
        uid,
      });
    } catch (error) {
      alert("Error storing user data: " + error.message);
    }
  };

  const handleSubmit = () => {
    if (
      !name ||
      !mobile ||
      !lichess ||
      !gender ||
      !district ||
      // !fide ||
      (!isGoogleSignIn && (!password || !confirmPassword))
    ) {
      setErrorMessage("All fields are required.");
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setErrorMessage("Mobile number must be exactly 10 digits.");
      setIsLoading(false);

      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);

      return;
    }

    setErrorMessage("");
    setIsLoading(true);
    if (isGoogleSignIn) {
      storeUserData(auth.currentUser.uid);
      setIsLoading(false);
      navigate("/admin");
    } else {
      handleRegister();
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
      <div className="px-4 mx-5 py-10 overflow-y-auto w-full max-w-md bg-black border h-fit border-white shadow-lg rounded-xl">
        <h1 className="text-4xl pb-10 text-orange-500 font-semibold text-center">
          Register
        </h1>
        <div>
          {!isGoogleSignIn && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              disabled={isGoogleSignIn || isLoading}
            />
          )}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Phone Number ( Whatsapp )"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Lichess Username"
            value={lichess}
            onChange={(e) => setLichess(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            disabled={isLoading}
          />
          {/* <input
            type="text"
            placeholder="Fide ID"
            value={fide}
            onChange={(e) => setFide(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            disabled={isLoading}
          /> */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            disabled={isLoading}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            disabled={isLoading}
          />
          {!isGoogleSignIn && (
            <>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
                disabled={isGoogleSignIn || isLoading}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
                disabled={isGoogleSignIn || isLoading}
              />
            </>
          )}

          <div className="mt-4 flex justify-between text-sm text-white">
            <button
              onClick={() => navigate("/login")}
              className="hover:underline"
              disabled={isLoading}
            >
              Already registred?
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errorMessage}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full p-2 bg-cyan-500 text-white rounded hover:bg-blue-500 hover:text-black"
            disabled={isLoading}
          >
            {isLoading
              ? "Registering..."
              : isGoogleSignIn
              ? "Complete Registration"
              : "Register"}{" "}
          </button>

          {!isGoogleSignIn && (
            <>
              <button
                onClick={handleGoogleSignIn}
                className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4"
                disabled={isLoading}
              >
                Signup with Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
