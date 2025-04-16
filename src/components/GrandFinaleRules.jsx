import React from "react";

const GrandFinaleRules = () => {
  //States
  const rules = [
    { title: "Tournament Mode", description: "Offline" },
    {
      title: "Location",
      description: "Wisdom Hub Chess Academy (Sulur, Coimbatore)",
    },
    {
      title: "Time Control",
      description: "05 Minutes + 00 Seconds from Move No.1",
    },
    {
      title: "Rules",
      description:
        "FIDE rules in force shall apply. FIDE Fair Play Regulations will be in force and players are obliged to respect the rules.",
    },
    { title: "System of Play", description: "Round Robin (9 Rounds)" },
    {
      title: "Tie-break",
      description:
        "1. Direct Encounter\n2. Sonneborn Berger (sum of scores of opponents whom a player has defeated plus half the sum of the scores of the opponents with whom the player has drawn)\n3. Number of victories\n4. Number of wins with Black\nNote - Incase of tie , the last tie breaker will be changed.",
    },
    {
      title: "Prizes and Certificate",
      description:
        "A player is eligible for only one prize whichever is higher. 'Income Tax Applicable as per Rule'. Prizes will not be given in advance. Prizes should be collected during the Prize distribution function otherwise, the prize will be forfeit.",
    },
    {
      title: "Wrist watches and Mobile",
      description:
        "AICF has banned the wrist watches while playing in FIDE Rated events. All electronic items including mobiles, Bluetooth devices, and wrist watches (all types of watches) are not allowed in the tournament hall.",
    },
    {
      title: "SLOT 9",
      description:
        "One slot is reserved for a titled player (chosen based on the highest title among applicants). You can apply: wisdomhubslot9@gmail.com",
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
      <h3 className="text-lg text-cyan-400">NO ENTRY FEE</h3>
      <div className="overflow-x-auto mt-5">
        <table className="w-full border-collapse border border-orange-500 text-lg">
          <tbody>
            {rules.map((rule, index) => (
              <tr key={index} className="border border-orange-500">
                <td className="border border-orange-500 p-3 text-cyan-400 font-bold">
                  {rule.title}
                </td>
                <td className="border text-left border-orange-500 p-3 text-gray-300 whitespace-pre-line">
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

export default GrandFinaleRules;
