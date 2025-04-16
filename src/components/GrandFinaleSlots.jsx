import React from "react";

const GrandFinaleSlots = () => {
  //States
  const slots = [
    {
      title: "SLOT 1 TO 6",
      description:
        "The top 6 players on the Open Points Table will automatically qualify for the Grand Finale.",
    },
    {
      title: "SLOT 7 & 8",
      description:
        "The top 2 players on the Women’s Points Table will secure direct qualification.",
    },
    {
      title: "SLOT 9",
      description:
        "One slot is reserved for a titled player (chosen based on the highest title among applicants).",
    },
    {
      title: "SLOT 10",
      description:
        "The final slot will be awarded at the discretion of the tournament organizers.",
    },
  ];

  return (
    <div
       className="bg-transparent m-5 text-white p-5 font-bebas-neue text-center border-4 border-dashed border-gray-500"
    >
      <h1 className="text-4xl font-extrabold text-orange-500 mb-3">
        RULES AND REGULATIONS
      </h1>
      <h2 className="text-2xl text-cyan-400">GRAND FINALE</h2>
      <div className="bg-orange-500 text-black text-2xl font-bold py-2 px-4 inline-block rounded-md my-3">
        WHO WILL PLAY GRAND FINALE?
      </div>

      <div className="space-y-5">
        {slots.map((slot, index) => (
          <div key={index}>
            <h3 className="text-cyan-400 text-xl font-bold">{slot.title}</h3>
            <div className="border border-orange-500 p-3 text-lg text-gray-300">
              {slot.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrandFinaleSlots;
