import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import AdminPage from "./pages/AdminPage";
import Register from "./components/Register";
import Details from "./pages/Details";
import ProfilePage from "../src/pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useState } from "react";

function App() {
  //States
  const [userType, setUserType] = useState(localStorage.getItem("type"));

  //Functions
  useEffect(() => {
    const handleStorageChange = () => {
      setUserType(localStorage.getItem("type"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          {userType === "Admin" ? (
            <>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/details" element={<Details />} />
              <Route path="/profile" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/details" element={<Navigate to="/login" />} />
              <Route path="/admin" element={<Navigate to="/login" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
