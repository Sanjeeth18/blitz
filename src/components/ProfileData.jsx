import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from "./backend/firebase-config";
import { getDoc, doc, setDoc } from "firebase/firestore";

const Profile = ({ user }) => {
  //States
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [loader, setLoader] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  //Functions
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        setLoader(true);
        try {
          const userRef = doc(firestore, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUpdatedUser(userSnap.data());
          } else {
            console.log("No user data found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setLoader(false);
      } else {
        setLoader(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleEdit = (field, value) => {
    setUpdatedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    sessionStorage.removeItem("registered");
    if (user.type === "Admin") navigate("/admin");
    else navigate("/");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleSave = async () => {
    if (
      Object.values(updatedUser).some(
        (value) => typeof value === "string" && value.trim() === ""
      )
    ) {
      setErrorMessage("All fields must be filled.");
      return;
    }

    if (!/^\d{10}$/.test(updatedUser.mobile)) {
      setErrorMessage("Mobile number must be exactly 10 digits.");
      return;
    }

    setErrorMessage("");
    if (!user?.uid) {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(userRef, updatedUser);
      setEditMode(false);
    } catch (error) {
      alert("Error storing user data: " + error.message);
    }
  };

  return (
    <div className="pt-32 bg-black flex flex-col justify-center text-orange-500 h-fit p-6 max-w-lg mx-auto shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
      <div className="bg-gray-900 p-4 rounded-lg">
        {loader ? (
          <div className="flex justify-center py-10">
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2 flex flex-col justify-center">
              <ProfileField
                label="Name"
                field="name"
                value={updatedUser.name}
                onEdit={handleEdit}
                editMode={editMode}
              />
              {updatedUser.fide && (
                <ProfileField
                  label="FIDE ID"
                  field="fide"
                  value={updatedUser.fide}
                  onEdit={handleEdit}
                  editMode={editMode}
                />
              )}
              <ProfileField
                label="Gender"
                field="gender"
                value={updatedUser.gender}
                onEdit={handleEdit}
                editMode={editMode}
              />
              <ProfileField
                label="Email"
                field="email"
                value={updatedUser.email}
                onEdit={handleEdit}
                editMode={editMode}
                disable={updatedUser.isGoogleSignIn ? true : false}
              />
              <ProfileField
                label="District"
                field="district"
                value={updatedUser.district}
                onEdit={handleEdit}
                editMode={editMode}
              />
              <ProfileField
                label="Lichess ID"
                field="lichess"
                value={updatedUser.lichess}
                isLink
                onEdit={handleEdit}
                editMode={editMode}
              />
              <ProfileField
                label="Mobile No"
                field="mobile"
                value={updatedUser.mobile}
                onEdit={handleEdit}
                editMode={editMode}
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {errorMessage}
                </p>
              )}
            </div>
            <button
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {editMode ? "Save Changes" : "Edit Profile"}
            </button>
            <button
              onClick={() => {
                handleLogout();
              }}
              className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({
  label,
  field,
  value,
  isLink,
  onEdit,
  editMode,
  disable = false,
}) => (
  <div className="flex justify-between items-center border-b border-orange-500 pb-1">
    <span className="font-bold">{label}:</span>
    {editMode ? (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onEdit(field, e.target.value)}
        className="bg-gray-800 text-white border border-orange-500 px-2 py-1 rounded-md"
        disabled={disable}
      />
    ) : isLink ? (
      <a
        href={`https://lichess.org/@/${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline"
      >
        {value}
      </a>
    ) : (
      <span>{value}</span>
    )}
  </div>
);

export default Profile;
