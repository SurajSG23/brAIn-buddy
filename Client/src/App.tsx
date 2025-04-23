import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/custom/LandingPage";
import Header from "./components/custom/Header";
import Footer from "./components/custom/Footer";

const App = () => (
  <div className="w-full min-h-[100vh] flex flex-col justify-between items-center ">
    {/* <Header /> */}
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
    {/* <Footer /> */}
  </div>
);

export default App;
