import React from "react";

const TournamentRules = () => {
  //States
  const rules = [
    { title: "Tournament Mode", description: "Online" },
    { title: "Platform", description: "Lichess.org" },
    { title: "Format", description: "7 Round Swiss" },
    {
      title: "Time Control",
      description: "05 Minutes + 00 Seconds from Move No.1",
    },
    {
      title: "Fair Play",
      description:
        "Any player found using an engine will be disqualified from receiving a prize and banned from future tournaments.",
    },
    {
      title: "Internet",
      description:
        "The organizer will not be responsible for any network issues.",
    },
    { title: "Decision", description: "The organizer’s decision is final." },
    {
      title: "Prizes",
      description:
        "Prizes will be awarded within 48 hours after the engine test and analysis process.",
    },
    {
      title: "Prizes Sharing",
      description:
        "A player is eligible for only one prize (which is higher). In case of a tie, the prize will not be shared.",
    },
    { title: "Tie break", description: "Sonneborn–Berger" },
  ];

  return (
    <div className="bg-transparent m-5 text-white p-5 font-bebas-neue text-center border-4 border-dashed border-gray-500">
      <h1 className="text-4xl font-extrabold text-orange-500 mb-3">
        RULES AND REGULATIONS
      </h1>
      <h2 className="text-2xl text-cyan-400">LEAGUE TOURNAMENT</h2>
      <h3 className="text-lg text-cyan-400">
        ENTRY FEE: 250 (PER LEAGUE TOURNAMENT)
      </h3>
      <div className="overflow-x-auto mt-5">
        <table className="w-full border-collapse border border-orange-500 text-lg">
          <tbody>
            {rules.map((rule, index) => (
              <tr key={index} className="border border-orange-500">
                <td className="border border-orange-500 p-3 text-cyan-400 font-bold">
                  {rule.title}
                </td>
                <td className="border text-left border-orange-500 p-3 text-gray-300">
                  {rule.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TournamentRules;
