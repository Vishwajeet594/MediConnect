import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import FindDoctor from "../pages/FindDoctor/FindDoctor";
import DoctorDetails from "../pages/DoctorDetails/DoctorDetails";
import OnlineConsultation from "../pages/OnlineConsultation/OnlineConsultation";
import About from "../pages/About/About";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/find-doctor" element={<ProtectedRoute><FindDoctor /></ProtectedRoute>} />
      <Route path="/doctors/:id" element={<ProtectedRoute><DoctorDetails /></ProtectedRoute>} />
      <Route path="/consultation/:appointmentId" element={<ProtectedRoute><OnlineConsultation /></ProtectedRoute>} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
