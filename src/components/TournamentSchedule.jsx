import React, { useState, useEffect } from "react";
import Qr_code from "../assets/QR.jpg";
import CustomModal from "./Dialog";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "./backend/firebase-config";

const TournamentSchedule = ({ admin = false }) => {
  //States
  const navigate = useNavigate();
  const registered =
    sessionStorage.getItem("registered") || localStorage.getItem("login");
  const [selectedTournamentForRegister, setSelectedTournamentForRegister] =
    useState(null);
  const [tournaments, setTournaments] = useState([
    {
      name: "",
      date: "",
      day: "",
      timeControl: "",
    },
  ]);
  const [selectedTournamentForEdit, setSelectedTournamentForEdit] = useState({
    name: "",
    date: "",
    day: "",
    timeControl: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 694);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [TournamentDetails, setTournamentDetails] = useState({
    name: "",
    date: "",
    day: "",
    timeControl: "",
    uid: "",
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const transactions = localStorage.getItem("transactions");
  const transactionArray = transactions ? transactions.split(",") : [];
  const [refresh, setRefresh] = useState(transactionArray);

  //Functions
  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (JSON.stringify(refresh) !== JSON.stringify(transactionArray)) {
      setRefresh(transactionArray);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [transactionArray]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 694);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isEventCompleted = (eventDate) => {
    const [day, month, year] = eventDate.split(".").map(Number);
    const eventDateObj = new Date(year, month - 1, day);
    return eventDateObj < new Date();
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e, setState, state) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const openDialog = (player = null) => {
    if (player) {
      setTournamentDetails(player);
      setEditMode(true);
    } else {
      setTournamentDetails({
        name: "",
        day: "",
        date: "",
        timeControl: "",
        uid: "",
      });
      setEditMode(false);
    }
    setIsDialogOpen(true);
  };

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { tournament } = docSnap.data();

        const sortedTournaments = tournament.sort((a, b) => {
          return (
            new Date(a.date.split(".").reverse().join("-")) -
            new Date(b.date.split(".").reverse().join("-"))
          );
        });

        setTournaments(sortedTournaments);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleaddForadd = async () => {
    try {
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingTournaments = docSnap.data().tournament || [];

        const formattedDate = new Date(TournamentDetails.date)
          .toLocaleDateString("fr-CA")
          .split("-")
          .reverse()
          .join(".");

        const newTournament = {
          ...TournamentDetails,
          date: formattedDate,
          uid: crypto.randomUUID(),
        };

        const updatedTournaments = [...existingTournaments, newTournament];

        await updateDoc(docRef, { tournament: updatedTournaments });

        fetchTournaments();
      }
    } catch (error) {
      console.error("Error adding tournament:", error);
    }
    closeDialog();
  };

  const handleaddForedit = async () => {
    try {
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingTournaments = docSnap.data().tournament || [];

        const formattedDate = new Date(selectedTournamentForEdit.date)
          .toLocaleDateString("fr-CA")
          .split("-")
          .reverse()
          .join(".");

        const updatedTournaments = existingTournaments.map((tournament) =>
          tournament.uid === selectedTournamentForEdit.uid
            ? { ...selectedTournamentForEdit, date: formattedDate }
            : tournament
        );

        await updateDoc(docRef, { tournament: updatedTournaments });

        fetchTournaments();
        console.log("Tournament updated successfully");
      }
    } catch (error) {
      console.error("Error updating tournament:", error);
    }
    closeDialog();
  };

  const handleDelete = async (tourId) => {
    try {
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingTournaments = docSnap.data().tournament || [];

        const updatedTournaments = existingTournaments.filter(
          (tournament) => tournament.uid !== tourId
        );

        await updateDoc(docRef, { tournament: updatedTournaments });

        fetchTournaments();
        console.log("Tournament deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }
    closeDialog();
  };

  const handleSubmitForUser = async () => {
    if (!selectedTournamentForRegister.paymentStatus) {
      setErrorMessage("Transaction ID is required.");
      return;
    }
    if (!selectedTournamentForRegister.upi) {
      setErrorMessage("Upi number is required.");
      return;
    }
    if (!/^\d{10}$/.test(selectedTournamentForRegister.upi)) {
      setErrorMessage("Mobile number must be exactly 10 digits.");
      return;
    }

    setErrorMessage("");
    const storedData = localStorage.getItem("data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);

        const userRef = doc(collection(firestore, "transactions"));

        const today = new Date();

        await setDoc(userRef, {
          name: parsedData.name || "",
          email: parsedData.email || "",
          mobile: parsedData.mobile || "",
          lichess: parsedData.lichess || "",
          fide: parsedData.fide || "",
          gender: parsedData.gender || "",
          district: parsedData.district || "",
          category: selectedTournamentForRegister.name,
          transaction_date:
            today.getDate().toString().padStart(2, "0") +
            "-" +
            (today.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            today.getFullYear(),
          transaction_id: selectedTournamentForRegister.paymentStatus,
          upi: selectedTournamentForRegister.upi,
          uid: userRef.id,
        });

        transactionArray.push(selectedTournamentForRegister.name);

        localStorage.setItem("transactions", transactionArray);
      } catch (error) {
        alert("Error storing transaction data: " + error.message);
      } finally {
        closeDialog();
      }
    }
  };

  return (
    <div
      id="league-schedule"
      className="bg-transparent bg-no-repeat m-5 border-4 border-dashed border-gray-500 text-white p-5 font-bebas-neue"
    >
      {/* Heading */}
      <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-orange-500 mb-5">
        LEAGUE TOURNAMENT SCHEDULE
      </h1>

      {!isLargeScreen && tournaments.length != 0 && (
        <div className="text-center text-cyan-400 text-lg sm:text-2xl my-5">
          EVERY {tournaments[0].day} @ 8:00 PM
        </div>
      )}

      {!isLargeScreen && tournaments.length != 0 && (
        <div className="text-center text-cyan-400 text-lg sm:text-2xl my-5">
          Time Control: {tournaments[0].timeControl}
        </div>
      )}

      {/* Admin Controls */}
      {admin && (
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex-1"></div>
          <div className="flex-1 text-center text-cyan-400 text-lg sm:text-2xl my-5">
            EVERY Saturday @ 8:00 PM
          </div>
          <div className="flex-1 flex justify-end pr-4">
            <button
              className="text-lg sm:text-2xl px-4 sm:px-6 bg-orange-500 border-2 border-white text-white py-1"
              onClick={() => {
                openDialog();
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-orange-500 text-sm sm:text-lg">
          <thead>
            <tr className="bg-gray-900 text-orange-500">
              <th className="border border-orange-500 p-2">EVENT NAME</th>
              <th className="border border-orange-500 p-2">DATE</th>
              {isLargeScreen && (
                <>
                  <th className="border border-orange-500 p-2">DAY</th>
                  <th className="border border-orange-500 p-2">Time Control</th>
                </>
              )}
              {admin && (
                <th className="p-2 border border-orange-400">ACTIONS</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={isLargeScreen ? 5 : 4} className="text-center p-4">
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
                  </div>
                </td>
              </tr>
            ) : tournaments.length === 0 ? (
              <tr>
                <td
                  colSpan={isLargeScreen ? 5 : 4}
                  className="text-center p-4 text-gray-200"
                >
                  There are no events
                </td>
              </tr>
            ) : (
              tournaments.map((event, index) => {
                const completed = isEventCompleted(event.date);
                return (
                  <tr key={index} className="text-gray-300 text-center">
                    <td className="border border-orange-500 text-left p-3">
                      {event.name}
                      <br />
                      {completed ? (
                        <span className="text-red-500 font-semibold">
                          Event Completed{" "}
                          {!admin &&
                            registered &&
                            (refresh.includes(event.name.toString())
                              ? "- Registered"
                              : "- Not Registered")}
                        </span>
                      ) : !admin ? (
                        <a
                          className={`${
                            refresh.includes(event.name.toString())
                              ? "text-orange-400 font-bold"
                              : "text-blue-400 underline"
                          }  block mt-1 hover:cursor-pointer`}
                          target="_blank"
                          onClick={() => {
                            if (!refresh.includes(event.name.toString())) {
                              if (registered) {
                                setSelectedTournamentForRegister(event);
                                setIsDialogOpen(!isDialogOpen);
                              } else {
                                navigate("/login");
                              }
                            }
                          }}
                          rel="noopener noreferrer"
                        >
                          {refresh.includes(event.name.toString())
                            ? "Registered"
                            : "Register"}
                        </a>
                      ) : null}
                    </td>

                    <td className="border border-orange-500 p-2">
                      {event.date}
                    </td>

                    {isLargeScreen && (
                      <>
                        <td className="border border-orange-500 p-2">
                          {event.day}
                        </td>
                        <td className="border border-orange-500 p-2">
                          {event.timeControl}
                        </td>
                      </>
                    )}
                    {admin && (
                      <td className="border border-orange-400 p-2 flex flex-col sm:flex-row justify-center gap-2">
                        <button
                          className="border border-orange-400 px-4 sm:px-6 bg-green-700 py-2"
                          onClick={() => {
                            setSelectedTournamentForEdit(event);
                            setEditMode(!editMode);
                            openDialog(event);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="border border-orange-400 px-4 sm:px-5 bg-rose-700 py-2"
                          onClick={() => {
                            setSelectedTournamentForEdit(event);
                            handleDelete(event.uid);
                            setSelectedTournamentForEdit({
                              name: "",
                              date: "",
                              day: "",
                              timeControl: "",
                              uid: "",
                            });
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog Sections */}
      {/*For User*/}
      {isDialogOpen && selectedTournamentForRegister && !admin && (
        <CustomModal
          isOpen={isDialogOpen}
          closeModal={() => {
            closeDialog();
          }}
          title="Registration Form"
          onSubmit={handleSubmitForUser}
          submitLabel="Submit"
          cancelLabel="Cancel"
        >
          <div className="text-center bg-gray-700 p-3 rounded-md my-4">
            <h4 className="text-lg font-bold text-orange-400">
              Tournament Date
            </h4>
            <p className="text-xl font-semibold">
              {selectedTournamentForRegister.date}
            </p>
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
            value={selectedTournamentForRegister.paymentStatus}
            onChange={(e) =>
              handleInputChange(
                e,
                setSelectedTournamentForRegister,
                selectedTournamentForRegister
              )
            }
            className="w-full text-lg p-2 border rounded-lg bg-gray-700 text-white"
          />
          <input
            type="text"
            name="upi"
            placeholder="Upi Number"
            value={selectedTournamentForRegister.upi}
            onChange={(e) =>
              handleInputChange(
                e,
                setSelectedTournamentForRegister,
                selectedTournamentForRegister
              )
            }
            className="w-full text-lg p-2 border rounded-lg bg-gray-700 text-white"
          />

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errorMessage}
            </p>
          )}
        </CustomModal>
      )}
      {/** Add the events */}
      {isDialogOpen && admin && !editMode && (
        <CustomModal
          isOpen={isDialogOpen}
          closeModal={() => {
            setTournamentDetails({
              name: "",
              date: "",
              day: "",
              timeControl: "",
              uid: "",
            });
            closeDialog();
            setEditMode(!editMode);
          }}
          title="Add the Tournament"
          onSubmit={handleaddForadd}
          submitLabel="Add"
          cancelLabel="Cancel"
        >
          <div className="p-3 rounded-md my-4 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-orange-400">
              Tournament Details
            </h3>

            <label className="block text-left text-sm font-semibold mt-2">
              Event Name
            </label>
            <input
              type="text"
              name="name"
              value={TournamentDetails.name}
              onChange={(e) =>
                handleInputChange(e, setTournamentDetails, TournamentDetails)
              }
              className="w-full text-base sm:text-xl p-2 border rounded-lg bg-gray-700 text-white"
            />
            <label className="block text-left text-sm font-semibold mt-2">
              Day :
            </label>
            <input
              type="text"
              name="day"
              value={TournamentDetails.day}
              onChange={(e) =>
                handleInputChange(e, setTournamentDetails, TournamentDetails)
              }
              className="w-full text-base sm:text-xl p-2 border rounded-lg bg-gray-700 text-white"
            />

            <label className="block text-left text-sm font-semibold mt-2">
              Time Control :
            </label>
            <input
              type="text"
              name="timeControl"
              value={TournamentDetails.timeControl}
              onChange={(e) =>
                handleInputChange(e, setTournamentDetails, TournamentDetails)
              }
              className="w-full text-base sm:text-xl p-2 border rounded-lg bg-gray-700 text-white"
            />
            <label className="block text-left text-sm font-semibold mt-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={
                TournamentDetails.date
                  ? TournamentDetails.date.split(".").reverse().join("-")
                  : ""
              }
              onChange={(e) =>
                handleInputChange(e, setTournamentDetails, TournamentDetails)
              }
              className="w-full text-base sm:text-xl p-2 border rounded-lg bg-gray-700 text-white"
            />
          </div>
        </CustomModal>
      )}

      {isDialogOpen && admin && selectedTournamentForEdit && editMode && (
        <CustomModal
          isOpen={isDialogOpen}
          closeModal={() => {
            setSelectedTournamentForEdit({
              name: "",
              date: "",
              day: "",
              timeControl: "",
              uid: "",
            });
            closeDialog();
          }}
          title="Edit the tournament"
          onSubmit={handleaddForedit}
          submitLabel="Update"
          cancelLabel="Cancel"
        >
          <div className="text-center bg-gray-700 p-3 rounded-md my-4">
            <h4 className="text-lg font-bold text-orange-400">
              Tournament Date
            </h4>
            <p className="text-xl font-semibold">
              {selectedTournamentForEdit.date}
            </p>
            <div className="p-3 rounded-md my-4 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-orange-400">
                Tournament Details
              </h3>

              <label className="block text-left text-sm font-semibold mt-2">
                Event Name
              </label>
              <input
                type="text"
                name="name"
                value={selectedTournamentForEdit.name}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    setSelectedTournamentForEdit,
                    selectedTournamentForEdit
                  )
                }
                className="w-full text-base sm:text-xl p-2 border rounded-lg bg-gray-700 text-white"
              />
              <label className="block text-left text-sm font-semibold mt-2">
                Day
              </label>
              <input
                type="text"
                name="day"
                value={selectedTournamentForEdit.day}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    setSelectedTournamentForEdit,
                    selectedTournamentForEdit
                  )
                }
                className="w-full text-base sm:text-xl p-2 border rounded-lg bg-gray-700 text-white"
              />

              <label className="block text-left text-sm font-semibold mt-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={
                  selectedTournamentForEdit.date
                    ? selectedTournamentForEdit.date
                        .split(".")
                        .reverse()
                        .join("-")
                    : ""
                }
                onChange={(e) =>
                  handleInputChange(
                    e,
                    setSelectedTournamentForEdit,
                    selectedTournamentForEdit
                  )
                }
                className="w-full text-base sm:text-xl p-2 border rounded-lg bg-gray-700 text-white"
              />
              <label className="block text-left text-sm font-semibold mt-2">
                Time Control
              </label>
              <input
                type="text"
                name="timeControl"
                value={selectedTournamentForEdit.timeControl}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    setSelectedTournamentForEdit,
                    selectedTournamentForEdit
                  )
                }
                className="w-full text-base sm:text-xl p-2 border rounded-lg bg-gray-700 text-white"
              />
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default TournamentSchedule;
