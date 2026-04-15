import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import FindDoctor from "../pages/FindDoctor/FindDoctor";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/find-doctor" element={<FindDoctor />} />

    </Routes>
  );
};

export default AppRoutes;