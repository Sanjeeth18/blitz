import React, { useState, useEffect } from "react";
import CustomModal from "./Dialog";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "./backend/firebase-config";

const GrandFinalePrizes = ({ admin = false }) => {
  //Sates
  const [data, setData] = useState({
    prizes: {},
    totalcash: "",
  });
  const { prizes, totalcash } = data;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogDataForSelected, setDialogDataForSelected] = useState({
    name: "",
    type: "",
    amount: "",
  });
  const [dialogDataForTotal, setDialogDataForTotal] = useState({
    amount: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Functions
  useEffect(() => {
    fetchPrize();
  }, []);

  const openDialog = (setState, state, data = {}) => {
    setState({
      ...state,
      ...data,
    });
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

  const fetchPrize = async () => {
    try {
      setLoading(true);

      const docRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { finale_amount, finale_prize_structure } = docSnap.data();
        const sortPrizes = (prizes) => {
          const customOrder = ["Winner", "Runner", "3rd Place", "4th to 10th"];

          return Object.entries(prizes)
            .sort(([a], [b]) => {
              return customOrder.indexOf(a) - customOrder.indexOf(b);
            })
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
        };
        const sortedFinale = sortPrizes(finale_prize_structure);

        setData({ totalcash: finale_amount, prizes: sortedFinale });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching PrizeStructures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTotalPrize = async () => {
    try {
      if (
        dialogDataForTotal.amount == undefined ||
        dialogDataForTotal.amount == ""
      ) {
        setErrorMessage("Enter the Fields.");
        return;
      }
      setErrorMessage("");

      const totalCashRef = doc(firestore, "dashboard", "datas");
      await updateDoc(totalCashRef, {
        finale_amount: dialogDataForTotal.amount,
      });
      fetchPrize();
      closeDialog();
    } catch (error) {
      console.error("Error updating total cash prize:", error);
    }
  };

  const handlePositionPrizes = async () => {
    try {
      if (
        dialogDataForSelected.amount == undefined ||
        dialogDataForSelected.amount == ""
      ) {
        setErrorMessage("Enter the Fields.");
        return;
      }
      setErrorMessage("");

      const finalePrizeRef = doc(firestore, "dashboard", "datas");
      const docSnap = await getDoc(finalePrizeRef);

      if (!docSnap.exists()) {
        throw new Error("Prizes document does not exist.");
      }

      const existingData = docSnap.data();
      const existingFinalePrizes = existingData.finale_prize_structure || {};
      const { name, amount } = dialogDataForSelected;
      const updatedFinalePrizes = {
        ...existingFinalePrizes,
        [name]: amount,
      };

      await updateDoc(finalePrizeRef, {
        finale_prize_structure: updatedFinalePrizes,
      });
      console.log("Finale prize updated:", updatedFinalePrizes);

      fetchPrize();
      closeDialog();
      setEditMode(!editMode);
    } catch (error) {
      console.error("Error adding finale prize:", error);
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
      const existingFinaleMap = existingData.finale_prize_structure || {};

      if (!(dialogDataForSelected.name in existingFinaleMap)) {
        throw new Error(
          `Place "${dialogDataForSelected.name}" not found in open map.`
        );
      }

      const { [dialogDataForSelected.name]: _, ...updatedOpenMap } =
        existingFinaleMap;

      await updateDoc(prizeRef, {
        finale_prize_structure: updatedOpenMap,
      });

      console.log(
        `Deleted place "${dialogDataForSelected.name}" from open map`
      );
      fetchPrize();
      setDialogDataForSelected({
        name: "",
        type: "",
        amount: "",
      });
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }

    closeDialog();
  };

  return (
    <div className="bg-transparent m-5 text-white p-5 font-bebas-neue text-center border-4 border-dashed border-gray-500">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-500 mb-3">
        PRIZE STRUCTURE
      </h1>

      {/* Grand Finale Section */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full">
        <div className="flex-1 text-center">
          <h2
            className={`text-2xl md:text-3xl text-cyan-400 ${
              admin ? "md:pl-28" : ""
            }`}
          >
            Grand Finale
          </h2>
        </div>
        {admin && (
          <div className="flex justify-center md:justify-end w-full md:w-auto">
            <button
              className="text-lg md:text-2xl px-4 md:px-6 bg-orange-500 border-2 border-white text-white py-1 mt-2 md:mt-0"
              onClick={() => {
                setDialogDataForTotal({
                  amount: data.totalcash,
                  uid: "",
                });
                setIsDialogOpen(true);
              }}
            >
              Prize
            </button>
          </div>
        )}
      </div>

      {/* Total Prize Money */}
      <div className="bg-white text-black text-lg sm:text-2xl font-bold py-2 px-4 inline-block rounded-md my-3">
        TOTAL CASH PRIZE <br />
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
          </div>
        ) : (
          `₹${totalcash}/-`
        )}
      </div>

      {/* Prizes Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-rows-3 gap-3 my-5">
          {Object.entries(data.prizes).map(([place, prize], index) => (
            <div
              key={index}
              className="border border-orange-500 p-2 sm:p-3 text-lg sm:text-xl font-bold"
            >
              {place} - ₹{prize}/-
              {admin && (
                <div className="p-2 flex justify-center space-x-3">
                  <button
                    className="border border-orange-400 px-4 bg-green-700 py-1"
                    onClick={() => {
                      setEditMode(!editMode);

                      setDialogDataForSelected({
                        name: place,
                        type: "tournament",
                        amount: prize,
                      });
                      setIsDialogOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDialogDataForSelected({
                        name: place,
                        type: "tournament",
                        amount: prize,
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

      {/* Dialog Box to update Total cash Prize*/}
      {isDialogOpen && !editMode && (
        <CustomModal
          isOpen={isDialogOpen}
          closeModal={() => {
            setDialogDataForTotal({
              amount: data.totalcash,
              uid: "",
            });

            closeDialog();
            setErrorMessage("");
          }}
          title="Total Cash Prize"
          onSubmit={handleTotalPrize}
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
          </div>
        </CustomModal>
      )}

      {isDialogOpen && editMode && (
        <CustomModal
          isOpen={isDialogOpen}
          closeModal={() => {
            setDialogDataForSelected({
              name: "",
              type: "",
              amount: "",
            });
            closeDialog();
            setEditMode(!editMode);
          }}
          title={dialogDataForSelected.name}
          onSubmit={handlePositionPrizes}
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
              value={dialogDataForSelected.amount}
              onChange={handleChange(setDialogDataForSelected)}
              className="w-full text-xl p-2 border bg-gray-700 text-white rounded"
            />
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default GrandFinalePrizes;
