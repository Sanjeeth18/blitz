import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import background from "../assets/Chessbackground.png";
import TournamentPlayers from "../components/Transaction";
import { firestore } from "../components/backend/firebase-config";
import { getDoc, doc } from "firebase/firestore";

function Details() {
  const [schedule, setSchedule] = useState([
    {
      name: "",
      date: "",
      day: "",
      uid: "",
      timeControl: "",
    },
  ]);
  const names = schedule.map((tournament) => tournament.name);
  const [loading, setLoading] = useState(true);

  //Functions
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { tournament } = docSnap.data();
        console.log("Tournaments before sorting:", tournament);

        const sortedTournaments = tournament.sort((a, b) => {
          return (
            new Date(a.date.split(".").reverse().join("-")) -
            new Date(b.date.split(".").reverse().join("-"))
          );
        });

        console.log("Tournaments after sorting:", sortedTournaments);
        setSchedule(sortedTournaments);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center  h-30">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
        </div>
      ) : (
        <>
          <div
            className="pb-5 bg-cover max-h- bg-fixed bg-center z-50  text-7xl"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backgroundBlendMode: "darken",
            }}
          >
            <Header admin={true} />
            <TournamentPlayers list={names} />
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default Details;
