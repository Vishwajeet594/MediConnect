import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const navbar = () => {
  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo">
        <Link to="/"><img src={logo} alt="DocEase Logo" /></Link>
      </div>

      {/* LINKS */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/find-doctor">Find Doctors</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      {/* ACTION BUTTONS */}
      <div className="nav-actions">
        <Link to="/login" className="login-btn">Admin</Link>
        <Link to="/signup" className="signup-btn">Create <br /> Account</Link>
      </div>
    </nav>
  );
};

export default navbar;