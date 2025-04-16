import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Profile from "../components/ProfileData";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../components/backend/firebase-config";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const uid = location.state?.uid;

  const fetchData = async () => {
    if (!uid) {
      console.error("UID is missing, cannot fetch data.");
      return;
    }
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        setUser(docSnapshot.data());
      } else {
        console.error("No such data in Firestore for the given UID");
      }
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchData();
    }
  }, [uid]);


  return (
    <div className="bg-black">
      <Header  />
      {user ? <Profile user={user} /> : <p>Loading...</p>}
      <Footer />
    </div>
  );
}

export default ProfilePage;
