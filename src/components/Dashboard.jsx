import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Qr_code from "../assets/QR.jpg";
import open_1 from "../assets/1.png";
import women_1 from "../assets/6.png";
import { firestore } from "./backend/firebase-config";
import { setDoc, doc, getDoc, getDocs, collection } from "firebase/firestore";
import CustomModal from "./Dialog";

const Dashboard = ({ admin = false }) => {
  //States
  const navigate = useNavigate();
  const today = new Date();
  const registered =
    sessionStorage.getItem("registered") || localStorage.getItem("login");
  const [tournaments, setTournaments] = useState([
    {
      name: "",
      date: "",
      day: "",
      uid: "",
      timeControl: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const transactions = localStorage.getItem("transactions");
  const transactionArray = transactions ? transactions.split(",") : [];
  const [transactionHistory, setRefresh] = useState(transactionArray);
  const nextTournament = tournaments
    .map((tournament) => ({
      ...tournament,
      dateObject: new Date(tournament.date.split(".").reverse().join("-")),
    }))
    .filter((tournament) => tournament.dateObject >= today)
    .sort((a, b) => a.dateObject - b.dateObject)[0];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState({
    name: "",
    lichessId: "",
    points: "",
    upi: "",
    paymentStatus: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  //Functions
  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(transactionHistory) !== JSON.stringify(transactionArray)
    ) {
      setRefresh(transactionArray);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [transactionArray]);

  useEffect(() => {
    const fetchWinnerImages = async () => {
      const docRef = doc(firestore, "images", "winners");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setWinnerImages(docSnap.data());
      }
    };
    fetchWinnerImages();
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 750);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);

      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { tournament } = docSnap.data();
        setTournaments(tournament);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e) => {
    setSelectedPlayer({ ...selectedPlayer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!selectedPlayer.paymentStatus) {
      setErrorMessage("Transaction ID is required.");
      return;
    }
    if (!selectedPlayer.upi) {
      setErrorMessage("UPI number is required.");
      return;
    }
    if (!/^\d{10}$/.test(selectedPlayer.upi)) {
      setErrorMessage("Upi number must be exactly 10 digits.");
      return;
    }

    setErrorMessage("");
    const storedData = localStorage.getItem("data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const userRef = doc(
          firestore,
          "transactions",
          selectedPlayer.paymentStatus
        );
        await setDoc(userRef, {
          name: parsedData.name || "",
          email: parsedData.email || "",
          mobile: parsedData.mobile || "",
          lichess: parsedData.lichess || "",
          fide: parsedData.fide || "",
          gender: parsedData.gender || "",
          district: parsedData.district || "",
          category: nextTournament.name,
          transaction_date:
            today.getDate().toString().padStart(2, "0") +
            "-" +
            (today.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            today.getFullYear(),
          transaction_id: selectedPlayer.paymentStatus,
          upi: selectedPlayer.upi,
        });
        transactionArray.push(nextTournament.name);
        localStorage.setItem("transactions", transactionArray);
      } catch (error) {
        alert("Error storing transaction data: " + error.message);
      } finally {
        closeDialog();
      }
    }
  };

  //Need to refactor
  const [winnerImages, setWinnerImages] = useState({ open: "", women: "" });
  const cloudName = "YOUR_CLOUD_NAME";
  const uploadPreset = "YOUR_UPLOAD_PRESET";
  const uploadImage = async (imageUrl) => {
    const data = new FormData();
    data.append("file", imageUrl);
    data.append("upload_preset", uploadPreset);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const json = await res.json();
    return json.secure_url;
  };

  const handleUploadWinners = async () => {
    const openUrl = await uploadImage(open_1);
    const womenUrl = await uploadImage(women_1);
    await setDoc(doc(firestore, "images", "winners"), {
      open: openUrl,
      women: womenUrl,
    });
    setWinnerImages({ open: openUrl, women: womenUrl });
  };

  return (
    <div className="pt-32 text-white ml-5 mb-5 mr-5   font-bebas-neue text-center bg-transparent ">
      <div className="border-4 border-dashed border-gray-500 p-5 py-12">
        <h1 className="text-3xl md:text-7xl font-extrabold text-white mb-3">
          WISDOM HUB ACADEMY
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
          (Affiliated to Coimbatore District Chess Association)
        </h2>
        <p className="text-gray-300 text-lg md:text-2xl">Presents</p>
        <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
          WISDOM HUB’S OPEN ONLINE BLITZ CHESS TOURNAMENT SEASON -1
        </h2>
        {isMobile ? (
          <>
            <div className="flex flex-col justify-center items-center my-5 space-y-5">
              <div className="text-center p-5 w-full">
                <h3 className="text-lg font-bold">ENTRY FEE</h3>
                <p className="text-2xl font-extrabold text-orange-400">₹ 250</p>
                <p className="text-xs">(PER LEAGUE TOURNAMENT)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 text-black font-bold my-5">
              <div className="bg-white p-3 rounded-md text-center">
                <h4 className="text-xl">DATE (LEAGUE STAGE)</h4>
                <p className="text-2xl text-orange-500">
                  22-02-2025 TO 09-08-2025
                </p>
                <p className="text-xs">(ONLINE)</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <h4 className="text-xl">TOTAL CASH PRIZE</h4>
                <p className="text-2xl text-orange-500">₹ 4,15,000/-</p>
                <p className="text-xs">25 Prize Per Tournament</p>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center my-5 space-y-5">
              <div className="text-center p-5 w-full">
                <h3 className="text-lg font-bold">ENTRY FREE</h3>
                <p className="text-xs">
                  (FOR GRAND FINALE TOURNAMENT FOR TOP 10)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 text-black font-bold my-5">
              <div className="bg-white p-3 rounded-md text-center">
                <h4 className="text-xl">DATE (GRAND FINALE)</h4>
                <p className="text-lg text-orange-500">15-08-2025</p>
                <p className="text-xs">(OFFLINE)</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-center items-center my-5 space-y-5 md:space-y-0 md:space-x-5">
              <div className="text-center p-5 w-full md:w-1/3">
                <h3 className="text-lg md:text-xl font-bold">ENTRY FEE</h3>
                <p className="text-2xl md:text-3xl font-extrabold text-orange-400">
                  ₹ 250
                </p>
                <p className="text-xs md:text-sm">(PER LEAGUE TOURNAMENT)</p>
              </div>
              <div className="text-center p-5 w-full md:w-1/3">
                <h3 className="text-lg md:text-xl font-bold">ENTRY FREE</h3>
                <p className="text-xs md:text-sm">
                  (FOR GRAND FINALE TOURNAMENT FOR TOP 10)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black font-bold my-5">
              <div className="bg-white p-3 rounded-md text-center">
                <h4 className="text-xl md:text-lg">DATE (LEAGUE STAGE)</h4>
                <p className="text-2xl text-orange-500 md:text-xl">
                  22-02-2025 TO 09-08-2025
                </p>
                <p className="text-xs md:text-sm">(ONLINE)</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <h4 className="text-xl md:text-lg">TOTAL CASH PRIZE</h4>
                <p className="text-2xl md:text-3xl text-orange-500">
                  ₹ 4,15,000/-
                </p>
                <p className="text-xs md:text-sm">25 Prize Per Tournament</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <h4 className="text-xl md:text-lg">DATE (GRAND FINALE)</h4>
                <p className="text-lg text-orange-500 md:text-xl">15-08-2025</p>
                <p className="text-xs md:text-sm">(OFFLINE)</p>
              </div>
            </div>
          </>
        )}
        <table className="w-full border border-orange-400 text-sm md:text-xl bg-black text-white mt-5 rounded-md text-center">
          <tbody>
            <tr className="border border-orange-400 flex flex-col md:table-row">
              <td className="p-4 flex justify-center items-center space-x-2 border-b md:border-0">
                <span className="pt-2">📞</span>
                <a href="tel:+916382424153" className="hover:cursor-pointer">
                  +91 63824 24153
                </a>
              </td>
              <td className="p-4 border border-orange-400 text-center">
                {loading ? (
                  <div className="flex justify-center items-center  h-30">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
                  </div>
                ) : nextTournament ? (
                  <button
                    disabled={
                      admin ||
                      (!admin &&
                        transactionHistory.includes(
                          nextTournament.name.toString()
                        ))
                    }
                    onClick={() => {
                      if (
                        !admin &&
                        !transactionHistory.includes(
                          nextTournament.name.toString()
                        )
                      ) {
                        if (registered) {
                          setIsDialogOpen(!isDialogOpen);
                        } else {
                          navigate("/login");
                        }
                      } else {
                        navigate("/login");
                      }
                    }}
                    className={`bg-orange-500 text-black px-4 md:px-5 py-2 rounded-md ${
                      admin ||
                      transactionHistory.includes(
                        nextTournament.name.toString()
                      )
                        ? "bg-orange-900"
                        : "hover:bg-orange-900"
                    }  hover:cursor-pointer transition`}
                  >
                    <span className="font-bold">
                      {admin
                        ? "Register Now"
                        : transactionHistory.includes(
                            nextTournament.name.toString()
                          )
                        ? "Registered..."
                        : "Register Now"}
                    </span>
                  </button>
                ) : (
                  <span className="text-gray-400">No Upcoming Tournaments</span>
                )}
              </td>
              <td className="p-4 flex justify-center items-center space-x-2 border-t md:border-0">
                <span>🌐</span>
                <a href="https://lichess.org/" className="hover:cursor-pointer">
                  Platform: Lichess.org
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        {admin && (
          <button
            onClick={handleUploadWinners}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-5"
          >
            Upload Winners
          </button>
        )}
        <div className="flex flex-col md:flex-col w-full text-center text-3xl md:text-5xl font-bebas-neue font-bold items-center justify-center">
          <div className="text-3xl font-bold mt-3">Winners</div>
          <div className="w-full md:w-full">
            <div className="flex flex-col md:flex-row w-full justify-center items-center gap-5 mt-5">
              <img
                src={winnerImages.open || open_1}
                className="w-full md:w-full max-w-sm p-2"
                alt="Open 1"
              />
              <img
                src={winnerImages.women || women_1}
                className="w-full ml-3 md:w-full max-w-sm p-2"
                alt="Women 1"
              />
            </div>
          </div>
        </div>
        {isDialogOpen && (
          <CustomModal
            isOpen={isDialogOpen}
            closeModal={closeDialog}
            title="Register Form"
            onSubmit={handleSubmit}
            submitLabel="Register"
            cancelLabel="Cancel"
          >
            <div className="text-center bg-gray-700 p-3 rounded-md my-4">
              <h4 className="text-lg font-bold text-orange-400">
                Next Tournament Date
              </h4>
              <p className="text-xl font-semibold">{nextTournament.date}</p>
            </div>
            <div className="flex justify-center my-4">
              <img
                src={Qr_code}
                alt="Payment QR Code"
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
              />
            </div>
            <p className="text-lg font-semibold text-center mt-4">
              ENTRY FEE: ₹250
            </p>
            <input
              type="text"
              name="paymentStatus"
              placeholder="Transaction ID"
              value={selectedPlayer.paymentStatus}
              onChange={handleInputChange}
              className="w-full text-lg p-2 border rounded-lg bg-gray-700 text-white"
            />
            <input
              type="text"
              name="upi"
              placeholder="Upi Number( From Which Transaction is done )"
              value={selectedPlayer.upi}
              onChange={handleInputChange}
              className="w-full text-lg p-2 border rounded-lg bg-gray-700 text-white"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errorMessage}
              </p>
            )}
          </CustomModal>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
