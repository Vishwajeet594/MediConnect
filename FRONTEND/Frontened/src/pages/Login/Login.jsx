import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import doctorImg from "../../assets/icons/Gemini_Generated_Image_57epb357epb357ep.png";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await login(form);
      navigate("/find-doctor");
    } catch (error) {
      setServerError(error.message || "Unable to login. Please try again.");
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
              <p className="eyebrow">Welcome back to V MEDICONNECT</p>
              <h1>Access your care dashboard</h1>
              <p className="auth-copy">
                Login securely to manage your bookings, track your health, and find trusted doctors.
              </p>
            </div>

            {serverError && <div className="form-alert error">{serverError}</div>}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <label htmlFor="email">Email</label>
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
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <span className="input-icon"><FaLock /></span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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

              <div className="form-footnote">
                <Link to="/" className="text-link">
                  Forgot password?
                </Link>
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="switch-copy">
              New here? <Link to="/signup">Create your account</Link>
            </p>
          </section>

          <aside className="auth-panel">
            <div className="panel-content">
              <p className="eyebrow invert">V MEDICONNECT</p>
              <h2>Modern healthcare, simplified.</h2>
              <p>
                Keep appointments, consultations, and prescriptions organized in one modern experience.
              </p>
              <ul className="feature-list">
                <li>Fast doctor search</li>
                <li>Secure patient records</li>
                <li>Smart reminders</li>
              </ul>
            </div>
            <div className="panel-image">
              <img src={doctorImg} alt="Medical illustration" />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
