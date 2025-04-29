import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./components/custom/LandingPage";
import Header from "./components/custom/Header";
import Footer from "./components/custom/Footer";
import HomePage from "./components/custom/HomePage";
import EditPage from "./components/custom/EditPage";
import PodcastPage from "./components/custom/PodcastPage";
import TestPage from "./components/custom/TestPage";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full min-h-[100vh] flex flex-col justify-between items-center bg-zinc-900">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/editpage" element={<EditPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/testpage" element={<TestPage />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
