import "./About.css";
import about1 from "../../assets/images/about1.png";
import about2 from "../../assets/images/about2.png";
import about3 from "../../assets/images/about3.png";
import about_hero from "../../assets/images/about-hero.png";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/Footer/Footer";

const About = () => {
  return (
    <>
      <Navbar />

      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero-content">
            {/* <p className="about-badge">DocBook • About Us</p> */}
            <h1>Our Mission: Making Healthcare Effortless and Accessible</h1>
            <p className="about-hero-text">
              Connecting patients with trusted doctors for online and offline
              consultations, fast booking, and better care.
            </p>

            <div className="about-hero-actions">
              <button className="about-primary-btn">Schedule Care</button>
              <button className="about-secondary-btn">Find Doctors</button>
            </div>
          </div>

          <div className="about-hero-image">
            <div className="about-hero-image-inner">
              <img src={about_hero} alt="Doctors team" />
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon-wrap">
                <img src={about1} alt="Find doctor" />
              </div>
              <h3>1. Find Your Doctor</h3>
              <p>Choose from verified doctors and specialties.</p>
            </div>

            <div className="step-card">
              <div className="step-icon-wrap">
                <img src={about2} alt="Book appointment" />
              </div>
              <h3>2. Book an Appointment</h3>
              <p>Pick a suitable time and book in seconds.</p>
            </div>

            <div className="step-card">
              <div className="step-icon-wrap">
                <img src={about3} alt="Receive care" />
              </div>
              <h3>3. Receive Seamless Care</h3>
              <p>Get care through consultation and follow-up support.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;