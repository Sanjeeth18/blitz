import React, { useEffect, useState } from "react";
import CustomModal from "./Dialog";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "./backend/firebase-config";

const PrizeStructure = ({ admin = false }) => {
  //States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState({
    open: {},
    women: {},
    league_total_cash_prize: "",
  });
  const [dialogDataForTotal, setDialogDataForTotal] = useState({
    amount: "₹3,75,000/-",
    uid: "",
  });
  const [dialogDataForOpen, setDialogDataForOpen] = useState({
    place: "",
    type: "",
    amount: "",
    uid: "",
  });
  const [dialogDataForWomen, setDialogDataForWomen] = useState({
    place: "",
    type: "",
    amount: "",
    uid: "",
  });
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editWomen, setEditWomen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTotal, setEditTotal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Functions
  useEffect(() => {
    fetchPrize();
  }, []);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;

    setter((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTotalCash = async () => {
    try {
      if (
        dialogDataForTotal.amount === undefined ||
        dialogDataForTotal.amount === ""
      ) {
        setErrorMessage("Enter the Fields.");
        return;
      }
      setErrorMessage("");
      const totalCashRef = doc(firestore, "dashboard", "datas");
      await updateDoc(totalCashRef, {
        league_total_cash_prize: dialogDataForTotal.amount,
      });
      fetchPrize();
      setEditTotal(!editTotal);
      console.log("Total cash prize updated successfully!");
    } catch (error) {
      console.error("Error updating total cash prize:", error);
    }
  };

  const handleUpdateWomenPrizes = async () => {
    try {
      if (
        dialogDataForWomen.amount === undefined ||
        dialogDataForWomen.amount === ""
      ) {
        setErrorMessage("Enter the field.");
        return;
      }
      setErrorMessage("");

      const womenPrizeRef = doc(firestore, "dashboard", "datas");

      const docSnap = await getDoc(womenPrizeRef);
      if (!docSnap.exists()) {
        throw new Error("Prizes document does not exist.");
      }

      const existingData = docSnap.data();
      const existingWomenPrizes = existingData.women_prizes || {};

      const { place, amount } = dialogDataForWomen;

      const updatedWomenPrizes = {
        ...existingWomenPrizes,
        [place]: amount,
      };

      await updateDoc(womenPrizeRef, {
        women_prizes: updatedWomenPrizes,
      });

      console.log("Women prize updated:", updatedWomenPrizes);
      fetchPrize();
      closeDialog();
    } catch (error) {
      console.error("Error updating women prize:", error);
    }
  };

  const handleUpdateOpenPrizes = async () => {
    try {
      if (
        dialogDataForOpen.place === undefined ||
        dialogDataForOpen.amount === undefined ||
        dialogDataForOpen.amount === "" ||
        dialogDataForOpen.place === ""
      ) {
        setErrorMessage("Enter the field.");
        return;
      }
      setErrorMessage("");

      const openPrizeRef = doc(firestore, "dashboard", "datas");

      const docSnap = await getDoc(openPrizeRef);
      if (!docSnap.exists()) {
        throw new Error("Prizes document does not exist.");
      }
      const existingData = docSnap.data();
      const existingOpenPrizes = existingData.open_prize_structure || {};

      const { place, amount } = dialogDataForOpen;

      const updatedOpenPrizes = {
        ...existingOpenPrizes,
        [place]: amount,
      };

      await updateDoc(openPrizeRef, {
        open_prize_structure: updatedOpenPrizes,
      });
      console.log("Open prize updated:", updatedOpenPrizes);

      fetchPrize();
      closeDialog();
    } catch (error) {
      console.error("Error updating open prize:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const prizeRef = doc(firestore, "dashboard", "datas");

      const docSnap = await getDoc(prizeRef);
      if (!docSnap.exists()) {
        throw new Error("Prizes document does not exist.");
      }

      const existingData = docSnap.data();
      const existingOpenMap = existingData.open_prize_structure || {};

      if (!(dialogDataForOpen.place in existingOpenMap)) {
        throw new Error(
          `Place "${dialogDataForOpen.place}" not found in open map.`
        );
      }

      const { [dialogDataForOpen.place]: _, ...updatedOpenMap } =
        existingOpenMap;

      await updateDoc(prizeRef, {
        open_prize_structure: updatedOpenMap,
      });

      console.log(`Deleted place "${dialogDataForOpen.place}" from open map`);
      fetchPrize();
      setDialogDataForOpen({
        place: "",
        type: "",
        amount: "",
      });
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }

    closeDialog();
  };

  const fetchPrize = async () => {
    try {
      setLoading(true);
      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { open_prize_structure, women_prizes, league_total_cash_prize } =
          docSnap.data();
        const sortPrizes = (prizes) => {
          return Object.entries(prizes)
            .sort(([a], [b]) => {
              const numA = parseInt(a);
              const numB = parseInt(b);
              return numA - numB;
            })
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
        };

        const sortedOpen = sortPrizes(open_prize_structure);

        const sortedWomen = sortPrizes(women_prizes);

        const updatedData = {
          open: sortedOpen,
          women: sortedWomen,
          league_total_cash_prize,
        };

        setData(updatedData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching PrizeStructures:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent m-5 text-white p-5 font-bebas-neue text-center border-4 border-dashed border-gray-500">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-orange-500 mb-3">
        PRIZE STRUCTURE
      </h1>

      {/* League Tournament Section */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full">
        <div className="flex-1 text-center">
          <h2
            className={`text-2xl md:text-3xl text-cyan-400 ${
              admin ? "md:pl-28" : ""
            }`}
          >
            LEAGUE TOURNAMENT
          </h2>
        </div>
        {admin && (
          <div className="flex justify-center md:justify-end w-full md:w-auto">
            <button
              className="text-lg md:text-2xl px-4 md:px-6 bg-orange-500 border-2 border-white text-white py-1 mt-2 md:mt-0"
              onClick={() => {
                setDialogDataForTotal({
                  amount: data.league_total_cash_prize,
                  uid: "",
                });
                console.log(data);

                setEditTotal(!editTotal);
                openDialog();
              }}
            >
              Prize
            </button>
          </div>
        )}
      </div>

      {/* Total Prize Money */}
      <div className="bg-white text-black text-xl md:text-2xl font-bold py-2 px-4 inline-block rounded-md my-3">
        TOTAL CASH PRIZE <br />₹{data.league_total_cash_prize}/-
      </div>

      {/* Best Women Section */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full">
        <div className="flex-1 text-center">
          <h2
            className={`text-xl md:text-2xl text-cyan-400 font-bold
             `}
          >
            BEST WOMEN
          </h2>
        </div>
      </div>

      {/* Best Women Prizes */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3 mt-3">
          {Object.entries(data.women).map(([place, prize], index) => (
            <div
              key={index}
              className="border border-orange-500 p-2 md:p-3 text-lg"
            >
              {place} - ₹{prize}/-
              {admin && (
                <div className="p-2 flex justify-center space-x-3">
                  <button
                    className="border border-orange-400 px-4 bg-green-700 py-1"
                    onClick={() => {
                      setDialogDataForWomen({
                        place: place,
                        type: "Best Women",
                        amount: prize,
                      });
                      setEditWomen(!editWomen);
                      openDialog();
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Each Tournament Section */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full mt-10">
        <div className="flex-1 text-center">
          <h2
            className={`text-lg md:text-xl text-cyan-400 font-bold ${
              admin ? "md:pl-28" : ""
            } `}
          >
            EACH TOURNAMENT
          </h2>
        </div>
        {admin && (
          <div className="flex justify-center md:justify-end w-full md:w-auto">
            <button
              className="text-lg md:text-2xl px-4 md:px-6 bg-orange-500 border-2 border-white text-white py-1"
              onClick={() => {
                setAddOpen(!addOpen);
                setDialogDataForOpen({
                  place: "",
                  type: "",
                  amount: "",
                  uid: "",
                });
                openDialog();
              }}
            >
              Add
            </button>
          </div>
        )}
      </div>
      <p className="text-cyan-400 text-lg sm:text-xl">
        ₹15,000 X 25 PRIZE X 25 TMT
      </p>

      {/* Prizes Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-5">
          {Object.entries(data.open).map(([place, amount], index) => (
            <div key={index} className="border border-orange-500 p-3 text-lg">
              {place} - ₹{amount}/-
              {admin && (
                <div className="p-2 flex justify-center space-x-3">
                  <button
                    className="border border-orange-400 px-4 bg-green-700 py-1"
                    onClick={() => {
                      setDialogDataForOpen({
                        place: place,
                        type: "Open Tournament",
                        amount: amount,
                      });
                      setEditOpen(!editOpen);
                      openDialog();
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDialogDataForOpen({
                        place: place,
                        type: "Open Tournament",
                        amount: amount,
                      });

                      handleDelete();
                    }}
                    className="border border-orange-400 px-4 bg-rose-700 py-1"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialog Box */}

      {/**Update Total cash */}
      {isDialogOpen && dialogDataForTotal && editTotal && (
        <CustomModal
          isOpen={openDialog}
          closeModal={() => {
            setDialogDataForTotal({
              amount: data.total,
              uid: "",
            });
            closeDialog();
            setEditTotal(!editTotal);
            setErrorMessage("");
          }}
          title="Total Cash Prize"
          onSubmit={() => handleTotalCash()}
          submitLabel="Update"
          cancelLabel="Cancel"
        >
          <div className="mb-3">
            <label className="block text-left text-xl font-semibold mb-1">
              Amount:
            </label>
            <input
              type="text"
              name="amount"
              value={dialogDataForTotal.amount}
              onChange={handleChange(setDialogDataForTotal)}
              className="w-full text-xl p-2 border bg-gray-700 text-white rounded"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </CustomModal>
      )}

      {/**Edit women prizes */}

      {isDialogOpen && editWomen && (
        <CustomModal
          isOpen={openDialog}
          closeModal={() => {
            setDialogDataForWomen({
              place: "",
              type: "",
              amount: "",
            });
            closeDialog();
            setEditWomen(!editWomen);
            setErrorMessage("");
          }}
          title="Best Women"
          onSubmit={handleUpdateWomenPrizes}
          submitLabel="Update"
          cancelLabel="Cancel"
        >
          <div className="mb-3">
            <label className="block text-left text-xl font-semibold mb-1">
              Place :
            </label>
            <input
              type="text"
              name="place"
              value={dialogDataForWomen.place}
              disabled={true}
              className="w-full text-xl p-2 border bg-gray-900 text-white rounded"
            />
            <label className="block text-left text-xl font-semibold mb-1">
              Amount:
            </label>
            <input
              type="number"
              name="amount"
              value={dialogDataForWomen.amount}
              onChange={handleChange(setDialogDataForWomen)}
              className="w-full text-xl p-2 border bg-gray-700 text-white rounded"
            />{" "}
            {errorMessage !== "" && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </CustomModal>
      )}

      {/**Add Open prizes */}

      {isDialogOpen && addOpen && (
        <CustomModal
          isOpen={openDialog}
          closeModal={() => {
            setAddOpen(!addOpen);
            setDialogDataForTotal({
              place: "",
              type: "",
              amount: "",
              uid: "",
            });
            closeDialog();
            setErrorMessage("");
          }}
          title="Add Place & Prize"
          onSubmit={handleUpdateOpenPrizes}
          submitLabel="Add"
          cancelLabel="Cancel"
        >
          <div className="mb-3">
            <label className="block text-left text-xl font-semibold mb-1">
              Place :
            </label>
            <input
              type="text"
              name="place"
              value={dialogDataForOpen.name}
              onChange={handleChange(setDialogDataForOpen)}
              className="w-full text-xl p-2 border bg-gray-700 text-white rounded"
            />
            <label className="block text-left text-xl font-semibold mb-1">
              Amount:
            </label>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errorMessage}
              </p>
            )}
            <input
              type="text"
              name="amount"
              value={dialogDataForOpen.amount}
              onChange={handleChange(setDialogDataForOpen)}
              className="w-full text-xl p-2 border bg-gray-700 text-white rounded"
            />{" "}
          </div>
        </CustomModal>
      )}

      {/**Update open prizes */}
      {isDialogOpen && editOpen && (
        <CustomModal
          isOpen={openDialog}
          closeModal={() => {
            setDialogDataForOpen({
              place: "",
              type: "",
              amount: "",
            });
            closeDialog();
            setEditOpen(!editOpen);
            setErrorMessage("");
          }}
          title="Open Tournament"
          onSubmit={handleUpdateOpenPrizes}
          submitLabel="Update"
          cancelLabel="Cancel"
        >
          <div className="mb-3">
            <label className="block text-left text-xl font-semibold mb-1">
              Place :
            </label>
            <input
              type="text"
              name="place"
              value={dialogDataForOpen.place}
              onChange={handleChange(setDialogDataForOpen)}
              className="w-full text-xl p-2 border bg-gray-700 text-white rounded"
            />

            <label className="block text-left text-xl font-semibold mb-1">
              Amount:
            </label>
            <input
              type="text"
              name="amount"
              value={dialogDataForOpen.amount}
              onChange={handleChange(setDialogDataForOpen)}
              className="w-full text-xl p-2 border bg-gray-700 text-white rounded"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default PrizeStructure;
