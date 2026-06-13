import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import doctorImg from "../../assets/icons/Gemini_Generated_Image_57epb357epb357ep.png";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{7,15}$/.test(form.phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }
    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setServerError("");
    setServerSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    setServerSuccess("");

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await register(form);
      setServerSuccess("Your account was created successfully. Redirecting...");
      setTimeout(() => navigate("/find-doctor"), 700);
    } catch (error) {
      setServerError(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page auth-page--modern">
        <div className="auth-grid">
          <section className="auth-card">
            <div className="auth-card-head">
              <p className="eyebrow">Start your V MEDICONNECT journey</p>
              <h1>Create your secure healthcare account</h1>
              <p className="auth-copy">
                Join doctors, appointments, and care history in a beautifully designed patient portal.
              </p>
            </div>

            {serverError && <div className="form-alert error">{serverError}</div>}
            {serverSuccess && <div className="form-alert success">{serverSuccess}</div>}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <label htmlFor="fullName">Full name</label>
                <div className="input-group">
                  <span className="input-icon"><FaUser /></span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                  />
                </div>
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>

              <div className="form-row">
                <label htmlFor="email">Email address</label>
                <div className="input-group">
                  <span className="input-icon"><FaEnvelope /></span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@domain.com"
                  />
                </div>
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-row">
                <label htmlFor="phone">Phone number</label>
                <div className="input-group">
                  <span className="input-icon"><FaPhone /></span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>

              <div className="form-row">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <span className="input-icon"><FaLock /></span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-row">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="input-group">
                  <span className="input-icon"><FaLock /></span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="switch-copy">
              Already have an account? <Link to="/login">Login instead</Link>
            </p>
          </section>

          <aside className="auth-panel">
            <div className="panel-content">
              <p className="eyebrow invert">Premium care</p>
              <h2>One account to manage care.</h2>
              <p>
                Register in seconds and keep your appointments, medical history, and doctor matches all in one place.
              </p>
              <ul className="feature-list">
                <li>Secure patient profiles</li>
                <li>Instant appointment booking</li>
                <li>Personalized care timeline</li>
              </ul>
            </div>
            <div className="panel-image">
              <img src={doctorImg} alt="Medical support illustration" />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Signup;
