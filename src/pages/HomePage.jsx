import React from "react";
import GrandFinaleSchedule from "../components/FinaleSchedule";
import Footer from "../components/Footer";
import GrandFinalePrizes from "../components/GrandFinalePrizes";
import GrandFinaleRules from "../components/GrandFinaleRules";
import GrandFinaleSlots from "../components/GrandFinaleSlots";
import Header from "../components/Header";
import PointsTable from "../components/PointsTable";
import PrizeStructure from "../components/PrizeStructure";
import TournamentRules from "../components/TournamentRules";
import TournamentSchedule from "../components/TournamentSchedule";
import Dashboard from "../components/Dashboard";
import background from "../..//src/assets/Chessbackground.png";
import PointsTableRules from "../components/PointsTableRules";
import open_1 from "../../src/assets/1.png";
import open_2 from "../../src/assets/2.png";
import women_1 from "../../src/assets/6.png";
import women_2 from "../../src/assets/7.png";
import FAQ from "../components/FAQ";

function HomePage() {
  return (
    <>
      <div
        className="pb-5 bg-cover max-h- bg-fixed bg-center z-50  text-7xl"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "darken",
        }}
      >
        <Header />
        <Dashboard />
        <PointsTable
          title="Women"
          section="women-points"
          image_1={women_1}
          image_2={women_2}
        />
        <PointsTable
          title="Open"
          section="open-points"
          image_1={open_1}
          image_2={open_2}
        />
        <TournamentSchedule />
        <PrizeStructure />
        <TournamentRules />
        <GrandFinaleSchedule />
        <GrandFinalePrizes />
        <GrandFinaleRules />
        <GrandFinaleSlots />
        <PointsTableRules />
        <FAQ />
      </div>
      <Footer />
    </>
  );
}

export default HomePage;
