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
import background from "../../src/assets/Chessbackground.png";
import PointsTableRules from "../components/PointsTableRules";
import FAQ from "../components/FAQ";

function AdminPage() {
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
        <Header admin={true} />
        <Dashboard admin={true} />
        <PointsTable title="Women" section="women-points" admin={true} />
        <PointsTable title="Open" section="open-points" admin={true} />
        <TournamentSchedule admin={true} />
        <PrizeStructure admin={true} />
        <TournamentRules admin={true} />
        <GrandFinaleSchedule admin={true} />
        <GrandFinalePrizes admin={true} />
        <GrandFinaleRules admin={true} />
        <GrandFinaleSlots admin={true} />
        <PointsTableRules admin={true} />
        <FAQ admin={true} />
      </div>
      <Footer admin={true} />
    </>
  );
}

export default AdminPage;
