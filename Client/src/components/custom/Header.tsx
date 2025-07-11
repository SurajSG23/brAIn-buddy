import { MdLogout } from "react-icons/md";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [displayPic, setDisplayPic] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          navigate("/");
        }
        const userFound = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/register/getuser/${
            currentUser?.email
          }`,
          { withCredentials: true }
        );
        setId(userFound.data._id);

        if (currentUser) {
          setDisplayPic(currentUser?.photoURL);
          setDisplayName(currentUser?.displayName);
          setEmail(currentUser?.email);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.log(email);
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (window.location.pathname === "/homepage") {
      closeProject();
    }
  }, [navigate]);

  const closeProject = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/project/closeproject/${id}`,
        { withCredentials: true }
      );
      navigate("/homepage");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-99 ">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-transparent border-t-orange-500 border-b-orange-500 rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <header className="flex justify-between items-center bg-[#08090c] w-full p-3">
      <div className="flex items-center justify-center max-[395px]:w-[150px] max-[395px]:ml-3">
        <img src="favicon.png" alt="" width={35} />
        <img src="logo.png" alt="" width={200} />
      </div>
      {location.pathname === "/" ? (
        ""
      ) : (
        <div className="flex items-center justify-center gap-2">
          <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-500 cursor-pointer">
            <img
              src={displayPic ? displayPic : "default-profile.jpg"}
              alt="Profile Picture"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "default-profile.jpg")}
              title={displayName ? displayName : "User"}
            />
          </div>
          {location.pathname === "/homepage" ? (
            <button
              className="bg-orange-700 text-white font-semibold px-3 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 flex justify-center items-center gap-1 shadow-md cursor-pointer text-sm"
              onClick={() => {
                handleLogout();
              }}
            >
              <MdLogout /> Logout
            </button>
          ) : (
            <button
              className="bg-orange-700 text-white font-semibold px-3 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 flex justify-center items-center gap-1 shadow-md cursor-pointer text-sm"
              onClick={() => {
                closeProject();
              }}
            >
              <MdLogout /> Back
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
