import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "./backend/firebase-config";

const TournamentPlayers = ({ list }) => {
  //States
  const [players, setPlayers] = useState([]);
  const [selectedDropdown, setSelectedDropdown] = useState(
    list.length > 0 ? list[0] : ""
  );
  const [loading, setLoading] = useState(true);

  //Functions
  useEffect(() => {
    if (!selectedDropdown) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(
          query(
            collection(firestore, "transactions"),
            where("category", "==", selectedDropdown)
          )
        );
        const filteredPlayers = querySnapshot.docs.map((doc) => doc.data());
        setPlayers(filteredPlayers);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDropdown]);

  return (
    <div className="pt-32  bg-transparent ml-5 mr-5 mb-5  text-white p-5 font-bebas-neue">
      <div className="overflow-x-auto border-4 border-dashed border-gray-500 p-10">
        <div className="flex justify-center items-center mb-5 ">
          <select
            value={selectedDropdown}
            onChange={(e) => setSelectedDropdown(e.target.value)}
            className="text-sm md:text-xl bg-orange-500 text-white py-2 px-6"
          >
            {list.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <table className="w-full border-collapse border border-orange-500 text-xl">
          <thead>
            <tr className="bg-gray-900 text-orange-500">
              <th className="border border-orange-500 p-2">S.No</th>
              <th className="border border-orange-500 p-2">Name</th>
              <th className="border border-orange-500 p-2">Email</th>
              <th className="border border-orange-500 p-2">Number</th>
              <th className="border border-orange-500 p-2">Lichess</th>
              <th className="border border-orange-500 p-2">FIDE</th>
              <th className="border border-orange-500 p-2">District</th>
              <th className="border border-orange-500 p-2">Gender</th>
              <th className="border border-orange-500 p-2">UPI Number</th>
              <th className="border border-orange-500 p-2">Transaction Date</th>
              <th className="border border-orange-500 p-2">Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="flex flex-col justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
              </div>
            ) : players.length > 0 ? (
              players.map((player, index) => (
                <tr key={index} className="text-gray-300">
                  <td className="border border-orange-500 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-orange-500 p-2 text-center">
                    {player.name}
                  </td>
                  <td className="border border-orange-500 p-2 text-center">
                    {player.email}
                  </td>
                  <td className="border border-orange-500 p-2 text-center">
                    {player.mobile}
                  </td>
                  <td className="border border-orange-500 p-2 text-center">
                    <a
                      href={`https://lichess.org/@/${player.lichessId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      {player.lichess}
                    </a>
                  </td>
                  <td className="border border-orange-500 p-2 text-center">
                    {player.fide}
                  </td>
                  <td className="border border-orange-500 p-2 text-center">
                    {player.district}
                  </td>
                  <td className="border border-orange-500 p-2 text-center">
                    {player.gender}
                  </td>
                  <td className="border border-orange-500 p-2 text-center">
                    {player.upi}
                  </td>
                  <td className="border border-orange-500 p-2 text-center">
                    {player.transaction_date}
                  </td>
                  <td className="border border-orange-500 p-2 text-center">
                    {player.transaction_id}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-orange-500 p-4">
                  No players found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TournamentPlayers;
