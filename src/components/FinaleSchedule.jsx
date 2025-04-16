import React from "react";

const GrandFinaleSchedule = () => {
  return (
    <div
      id="finale-section"
      className="m-5 bg-transparent"
     >
      <div className="bg-cover text-white p-5 font-bebas-neue text-center border-4 border-dashed border-gray-500">
        <h1 className="text-4xl font-extrabold text-orange-500 mb-5 flex justify-center items-center">
          <span>🏆</span>
          GRAND FINALE SCHEDULE
          <span>🏆</span>
        </h1>

        <div className="text-cyan-400 text-3xl font-bold my-3">EVENT NAME</div>
        <div className="border border-orange-500 p-3 text-lg">
          WISDOM HUB 'S OPEN ONLINE BLITZ CHESS TOURNAMENT SEASON -1 GRAND
          FINALE
        </div>

        <div className="text-cyan-400 text-3xl font-bold my-3">DATE</div>
        <div className="border border-orange-500 p-3 text-lg">
          INDEPENDENCE DAY <br /> (15.08.2025)
        </div>

        <div className="text-cyan-400 text-3xl font-bold my-3">DAY & TIME</div>
        <div className="border border-orange-500 p-3 text-lg">
          FRIDAY @ 10:00 AM
        </div>

        <div className="text-cyan-400 text-3xl font-bold my-3">FORMAT</div>
        <div className="border border-orange-500 p-3 text-lg">ROUND ROBIN</div>

        <div className="text-cyan-400 text-3xl font-bold my-3">LOCATION</div>
        <div className="border border-orange-500 p-3 text-lg">
          Wisdom Hub Chess Academy <br /> (Sulur, Coimbatore)
        </div>
      </div>
    </div>
  );
};

export default GrandFinaleSchedule;
