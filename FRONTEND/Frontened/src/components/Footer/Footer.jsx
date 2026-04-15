import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">

      {/* LEFT SECTION */}
      <div className="about-footer">
        <div className="logo-footer">DOCEASE</div>
        <p className="content-footer">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="links-footer">

        {/* COMPANY */}
        <div className="company">
          <h3>COMPANY</h3>
          <ul className="nav-footer">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/find-doctor">Find Doctors</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* GET IN TOUCH */}
        <div className="get-touch">
          <h3>GET IN TOUCH</h3>
          <p>+0-000-000-000</p>
          <p>vk@gmail.com</p>

          <div className="social-icons">
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
            <FaLinkedinIn />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;