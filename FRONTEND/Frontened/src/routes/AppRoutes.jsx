import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import FindDoctor from "../pages/FindDoctor/FindDoctor";
import About from "../pages/About/About";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/find-doctor" element={<FindDoctor />} />
      <Route path="/about" element={<About />} />

    </Routes>
  );
};

export default AppRoutes;