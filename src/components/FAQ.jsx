import React, { useState } from "react";

const FAQ = () => {
  //States
  const faqData = [
    {
      question: "Who qualifies for the Grand Finale?",
      answer: `The Grand Finale will have 10 players, who qualify as follows:
      - Slots 1-6: The top 6 players from the Open Points Table.
      - Slots 7 & 8: The top 2 players from the Women's Points Table.
      - Slot 9: A titled player, selected based on the highest title among applicants.
      - Slot 10: A wildcard entry chosen at the discretion of the tournament organizers.`
    },
    {
      question: "How is the points table structured?",
      answer: `Each tournament awards points based on final standings:
      - The Open category awards points to the top 22 players, with the winner earning 25 points and the 22nd place earning 1 point.
      - The Women’s category awards points to the top 3 players, with the winner earning 15 points.
      - The leaderboard updates in real-time after each tournament.`
    },
    {
      question: "How many tournaments are there in the league?",
      answer: `There are 25 online blitz chess tournaments in the league. Players can participate in any number of these to improve their ranking on the points table.`
    },
    {
      question: "What is the entry fee for each league tournament?",
      answer: `The entry fee for each tournament is ₹250.`
    },
    {
      question: "What is the tournament format and time control?",
      answer: `- Format: 7-Round Swiss.
      - Time Control: 5 minutes + 0 seconds per move.
      - Platform: Lichess.org.`
    },
    {
      question: "What are the fair play rules?",
      answer: `Any player found using an engine or external assistance will be disqualified, forfeit their prize, and be banned from future tournaments.`
    },
    {
      question: "Who is responsible for internet issues during games?",
      answer: `Players are responsible for their own internet connections. The organizers are not responsible for network issues.`
    },
    {
      question: "How are prizes awarded?",
      answer: `- Prizes will be distributed within 48 hours after an engine test and analysis process.
      - A player is eligible for only one prize (the highest one they qualify for).
      - Prizes will not be shared in case of ties.`
    },
    {
      question: "What tie-break system is used?",
      answer: `The Sonneborn–Berger system will be used for tie-breaks.`
    },
    {
      question: "Can I play in multiple tournaments to improve my ranking?",
      answer: `Yes! You can participate in any number of the 25 tournaments to improve your position on the points table. Consistent performance across multiple events increases your chances of qualifying for the Grand Finale.`
    },
    {
      question: "What happens if I qualify in multiple ways for the Grand Finale?",
      answer: `If a player qualifies through multiple categories (e.g., Open Points Table and Women's Points Table), the higher-ranking qualification will be considered, and the next eligible player in the lower category will be given the slot.`
    },
    {
      question: "How is the titled player selected for the Grand Finale?",
      answer: `One slot is reserved for a titled player, who will be selected based on the highest chess title among applicants. If multiple titled players apply, selection criteria may include rating and tournament performance.`
    },
    {
      question: "What should I do if I face technical issues during a game?",
      answer: `Players are responsible for their own devices and internet connectivity. The organizer will not be liable for disconnections, lag, or network failures. It is recommended to ensure a stable internet connection before the tournament starts.`
    }
  ];
  const [openIndex, setOpenIndex] = useState(null);

  //Functions
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq-section" className="border-4 font-bebas-neue  px-10 border-dashed border-gray-500  bg-transparent text-white p-5  m-5 rounded-lg shadow-lg">
      {/* Heading */}
      <h1 className="text-center text-4xl font-extrabold text-orange-500 mb-5">
        Frequently Asked Questions (FAQ’s)
      </h1>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border  border-orange-500 rounded-lg">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between rounded-lg items-center p-4 bg-gray-800 text-lg font-semibold"
            >
              <span>{index+1}. {faq.question}</span>
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && (
              <div className="p-4 text-lg rounded-b-lg bg-gray-700 text-gray-300 transition-all duration-300">
                {faq.answer.split("\n").map((line, idx) => (
                  <p key={idx} className="mb-2">{line}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
