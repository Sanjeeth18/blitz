import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "./backend/firebase-config";

const PointsTableRules = () => {
  //States
  const [data, setData] = useState({
    open_pt_rules: [],
    women_pt_rules: [],
  });

  //Functions
  useEffect(() => {
    fetchPrizeRules();
  }, []);

  const fetchPrizeRules = async () => {
    try {
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { open_pt_rules, women_pt_rules } = docSnap.data();
        const updatedData = {
          open_pt_rules: open_pt_rules,
          women_pt_rules: women_pt_rules,
        };
        setData(updatedData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching PrizeStructures:", error);
    }
  };

  return (
    <div
      id="points-table"
      className="bg-transparent m-5 text-white p-5 font-bebas-neue text-center border-4 border-dashed border-gray-500"
    >
      <h1 className="text-4xl font-extrabold text-orange-500 mb-3">
        RULES AND REGULATIONS
      </h1>
      <h2 className="text-2xl text-cyan-400">POINTS TABLE</h2>

      <div className="text-left text-lg my-3">
        <p className="text-orange-500 font-bold">Points System</p>
        <ul className="list-disc pl-5">
          <li>
            The prize winner of each tournament will be awarded with points.
          </li>
          <li>Based on the points, the leaderboard will be updated!!</li>
        </ul>
      </div>
      <div className="text-cyan-400 text-xl font-bold my-3">WOMEN</div>
      <div className="flex flex-wrap justify-center gap-3">
        {data.women_pt_rules.map((point, index) => (
          <div key={index} className="border border-orange-500 p-2 text-lg">
            {point}
          </div>
        ))}
      </div>

      <div className="text-cyan-400 text-xl font-bold my-3">OPEN</div>
      <div className="grid grid-cols-2 gap-3 my-3">
        {data.open_pt_rules.map((point, index) => (
          <div key={index} className="border border-orange-500 p-2 text-lg">
            {point}
          </div>
        ))}
      </div>

      <div className="text-left mt-5">
        <p className="text-cyan-400 text-lg font-bold">NOTE :</p>
        <ul className="list-disc pl-5 text-gray-300 text-sm">
          <li>
            The league consists of 25 open online blitz chess tournaments.
          </li>
          <li>
            Players can participate in any or all 25 tournaments to improve
            their chances of ranking higher on the points table.
          </li>
          <li>
            Consistent performance and winning tournaments will help players
            maintain a top position on the leaderboard.
          </li>
          <li>
            Points will be awarded to the top 22 players in each league
            tournament based on their final standings.
          </li>
          <li>
            The leaderboard will be updated in real-time after each tournament.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PointsTableRules;
