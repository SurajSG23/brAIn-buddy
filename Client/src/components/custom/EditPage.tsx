import { useEffect, useState } from "react";
import LeftEditPage from "./LeftEditPage";
import RightEditPage from "./RightEditPage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

const EditPage = () => {
  const navigate = useNavigate();
  const [pdfURL, setPdfURL] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [txtURL, setTxtURL] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoadingPage(true);
      if (user?.email) {
        try {
          const userFound = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/register/getuser/${
              user.email
            }`,
            { withCredentials: true }
          );
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/project/openedProject/${
              userFound.data._id
            }`,
            { withCredentials: true }
          );
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/project/closeproject/${
              userFound.data._id
            }`,
            { withCredentials: true }
          );
          setPdfURL(res.data[0].originalPDF);
          setTitle(res.data[0].title);
          setTxtURL(res.data[0].convertedPDF);
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoadingPage(false);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loadingPage) {
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
    <div className="flex flex-row w-full justify-evenly items-center text-white gap-1 max-[850px]:flex-col">
      <div className="w-[50%] max-[850px]:w-full">
        <LeftEditPage txtURL={txtURL} title={title} />
      </div>
      <div className="w-[50%] max-[850px]:w-full">
        <RightEditPage title={title} pdfURL={pdfURL} />
      </div>
    </div>
  );
};

export default EditPage;
