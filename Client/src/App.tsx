import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/custom/LandingPage";
import Header from "./components/custom/Header";
import Footer from "./components/custom/Footer";
import HomePage from "./components/custom/HomePage";

const App = () => {
  return (
    <div className="w-full min-h-[100vh] flex flex-col justify-between items-center ">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
