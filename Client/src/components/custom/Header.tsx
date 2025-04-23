import { useLocation } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <header className="flex justify-between items-center bg-[#08090c] w-full p-3">
      <div className="flex items-center justify-center">
        <img src="favicon.png" alt="" width={35} />
        <img src="logo.png" alt="" width={200} />
      </div>
      {location.pathname === "/homepage" ? (
        <div>
          <button
            className="bg-orange-700 text-white font-semibold px-3 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 flex justify-center items-center gap-1 shadow-md cursor-pointer text-sm"
            onClick={() => {
              handleLogout();
            }}
          >
            <MdLogout /> Logout
          </button>
        </div>
      ) : (
        ""
      )}
    </header>
  );
};

export default Header;
