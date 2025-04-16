import React, { useState, useEffect } from "react";
import CustomModal from "./Dialog";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
import { firestore } from "./backend/firebase-config";

const PointsTable = ({ title, section, admin = false }) => {
  //States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState({
    name: "",
    lichess_id: "",
    points: "",
    type: title,
    uid: "",
  });
  const [createPlayer, setcreatePlayer] = useState({
    name: "",
    lichess_id: "",
    points: "",
    type: title,
    uid: "",
  });

  //Functions
  useEffect(() => {
    fetchPlayers();
  }, []);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e, setState, state) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const openDialog = (player = null) => {
    if (player) {
      setSelectedPlayer(player);
      setEditMode(true);
    } else {
      setSelectedPlayer({ name: "", lichessId: "", points: "", uid: "" });
      setEditMode(false);
    }
    setIsDialogOpen(true);
  };

  const handleSubmitForAddPlayer = async () => {
    try {
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fieldName = title === "Open" ? "open_points" : "women_points";
        const existingPlayers = docSnap.data()[fieldName] || [];

        const newPlayer = { ...createPlayer, uid: crypto.randomUUID() };

        const updatedPlayers = [...existingPlayers, newPlayer];

        await updateDoc(docRef, { [fieldName]: updatedPlayers });

        fetchPlayers(); 
        setcreatePlayer({ name: "", lichess_id: "", points: "", uid: "" });
        closeDialog();
      }
    } catch (error) {
      alert("Error adding player: " + error.message);
    }
  };

  const handleUpdateDetails = async () => {
    try {
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fieldName = title === "Open" ? "open_points" : "women_points";
        const existingPlayers = docSnap.data()[fieldName] || [];

        const updatedPlayers = existingPlayers.map((player) =>
          player.uid === selectedPlayer.uid ? selectedPlayer : player
        );

        await updateDoc(docRef, { [fieldName]: updatedPlayers });

        fetchPlayers(); 
        closeDialog();
      }
    } catch (error) {
      alert("Error updating player: " + error.message);
    }
  };

  const handleDelete = async (playerId) => {
    try {
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fieldName = title === "Open" ? "open_points" : "women_points";
        const existingPlayers = docSnap.data()[fieldName] || [];

        const updatedPlayers = existingPlayers.filter(
          (player) => player.uid !== playerId
        );

        await updateDoc(docRef, { [fieldName]: updatedPlayers });

        fetchPlayers(); 
      }
    } catch (error) {
      alert("Error deleting player: " + error.message);
    }
  };
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fieldName = title === "Open" ? "open_points" : "women_points";
        const pointsTable = docSnap.data()[fieldName] || [];

        const sortedData = pointsTable.sort((a, b) => b.points - a.points);

        setData(sortedData);
      }
    } catch (error) {
      console.error("Error fetching pointsTable:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id={section}
      className="text-white font-bebas-neue text-center p-5 border-4 border-dashed border-gray-500 m-5"
    >
      <div className="w-full">
        {admin ? (
          <div className="flex flex-wrap justify-between items-center w-full">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-orange-500 mb-3 py-3">
                POINTS TABLE <p>({title})</p>
              </h2>
            </div>
            <div className="flex-1 flex justify-end pr-4">
              <button
                className="text-lg md:text-2xl px-4 md:px-6 bg-orange-500 border-2 border-white text-white py-1 rounded-md"
                onClick={() => openDialog()}
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <h2 className="text-2xl md:text-3xl font-extrabold text-orange-500 mb-3 py-3">
            POINTS TABLE <p>({title})</p>
          </h2>
        )}
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
          </div>
        ) : (
          <table className="w-full border border-orange-400 text-xs md:text-lg text-white">
            <thead>
              <tr className="border bg-gray-900 border-orange-400 text-orange-500">
                <th className="p-2 border border-orange-400">RANK</th>
                <th className="p-2 border border-orange-400">NAME</th>
                <th className="p-2 border border-orange-400">LICHESS ID</th>
                <th className="p-2 border border-orange-400">POINTS</th>
                {admin && (
                  <th className="p-2 border border-orange-400">ACTIONS</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-2 text-center text-gray-200">
                    There is no data
                  </td>
                </tr>
              ) : (
                data.map((player, index) => (
                  <tr key={index} className="border border-orange-400">
                    <td className="p-2 border border-orange-400">
                      {index + 1}
                    </td>
                    <td className="p-2 border border-orange-400">
                      {player.name}
                    </td>
                    <td className="p-2 border border-orange-400">
                      <a
                        href={`https://lichess.org/@/${player.lichess_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                      >
                        {player.lichess_id}
                      </a>
                    </td>
                    <td className="p-2 border border-orange-400">
                      {player.points}
                    </td>
                    {admin && (
                      <td className="p-2 border border-orange-400 flex flex-wrap justify-center space-x-2">
                        <button
                          className="border border-orange-400 px-4 md:px-6 bg-green-700 py-1 md:py-2 text-xs md:text-base"
                          onClick={() => openDialog(player)}
                        >
                          Edit
                        </button>
                        <button
                          className="border border-orange-400 px-4 md:px-5 bg-rose-700 py-1 md:py-2 text-xs md:text-base"
                          onClick={() => handleDelete(player.uid)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}{" "}
      </div>

      {isDialogOpen && !editMode && (
        <CustomModal
          isOpen={isDialogOpen}
          closeModal={closeDialog}
          title="Add Player"
          onSubmit={handleSubmitForAddPlayer}
          submitLabel="Add"
          cancelLabel="Cancel"
        >
          <div className="mb-4">
            <label className="block text-xl md:text-2xl text-left font-semibold">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={createPlayer.name}
              onChange={(e) => {
                handleInputChange(e, setcreatePlayer, createPlayer);
              }}
              className="w-full p-2 border border-white bg-gray-700 text-white rounded text-base"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xl md:text-2xl text-left font-semibold">
              Lichess ID:
            </label>
            <input
              type="text"
              name="lichess_id"
              value={createPlayer.lichess_id}
              onChange={(e) => {
                handleInputChange(e, setcreatePlayer, createPlayer);
              }}
              className="w-full p-2 border border-white bg-gray-700 text-white rounded text-base"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xl md:text-2xl text-left font-semibold">
              Points:
            </label>
            <input
              type="number"
              name="points"
              value={createPlayer.points}
              onChange={(e) => {
                handleInputChange(e, setcreatePlayer, createPlayer);
              }}
              className="w-full p-2 border border-white bg-gray-700 text-white rounded text-base"
              min="1"
            />
          </div>
        </CustomModal>
      )}
      {isDialogOpen && editMode && (
        <CustomModal
          isOpen={isDialogOpen}
          closeModal={() => {
            setSelectedPlayer({
              name: "",
              lichess_id: "",
              points: "",
              uid: "",
            });
            closeDialog();
            setEditMode(!editMode);
          }}
          title="Edit Details"
          onSubmit={handleUpdateDetails}
          submitLabel="Update"
          cancelLabel="Cancel"
        >
          <div className="mb-4">
            <label className="block text-xl md:text-2xl text-left font-semibold">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={selectedPlayer.name}
              onChange={(e) => {
                handleInputChange(e, setSelectedPlayer, selectedPlayer);
              }}
              className="w-full p-2 border border-white bg-gray-700 text-white rounded text-base"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xl md:text-2xl text-left font-semibold">
              Lichess ID:
            </label>
            <input
              type="text"
              name="lichess_id"
              value={selectedPlayer.lichess_id}
              onChange={(e) => {
                handleInputChange(e, setSelectedPlayer, selectedPlayer);
              }}
              className="w-full p-2 border border-white bg-gray-700 text-white rounded text-base"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xl md:text-2xl text-left font-semibold">
              Points:
            </label>
            <input
              type="number"
              name="points"
              value={selectedPlayer.points}
              onChange={(e) => {
                handleInputChange(e, setSelectedPlayer, selectedPlayer);
              }}
              className="w-full p-2 border border-white bg-gray-700 text-white rounded text-base"
              min="1"
            />
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default PointsTable;
