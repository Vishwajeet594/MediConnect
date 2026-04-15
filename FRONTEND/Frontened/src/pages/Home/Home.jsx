import Navbar from "../../components/navbar/navbar";
import doctorImg from "../../assets/icons/Gemini_Generated_Image_57epb357epb357ep.png";
import heart from "../../assets/images/Heart1.png";
import brain from "../../assets/images/Brain.png";
import dentist from "../../assets/images/Dentist.png";
import skin from "../../assets/images/skin.png";
import eye from "../../assets/images/eye.png";
import "./Home.css";
import Footer from "../../components/Footer/Footer";
const Home = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
            <div className="bigHeading">
          <h1>Your Health, Our Priority <br/>
Find Trusted Doctors Easily</h1></div>
<div className="small">
          <p>Easily explore a wide network of <br/> experienced doctors and book your appointment in just a few clicks.</p></div>
          <button className="primary-btn">Find Doctors</button>
        </div>

        <div className="hero-image">
          <img src={doctorImg} alt="doctor" />
        </div>
      </section>

<section className="speciality">
    <div className="speciality_heading">
        <h1>Our Specialities</h1>
    </div>
   <div className="speciality_heading">
        <p>Explore trusted specialists across <br/>different medical fields and book appointments easily.</p>
    </div>

  {/* Speciality */}
   
    <div className="speciality_card">
        <div className="card">
             <img src={heart} alt="heart" />
            <h3>Cardiology</h3>
            </div>
        <div className="card">
             <img src={brain} alt="brain" />
            <h3>Dermatology</h3>
        </div>
        <div className="card">
             <img src={dentist} alt="dentist" />
            <h3>Cardiology</h3>
            </div>
        <div className="card">
            
             <img src={eye} alt="eye" />
            <h3>Dermatology</h3>
        </div>
        <div className="card">
             <img src={skin} alt="skin" />
            <h3>Cardiology</h3>
            </div>
     
    </div>


</section>

   <Footer />

    </>
  );
};

export default Home;