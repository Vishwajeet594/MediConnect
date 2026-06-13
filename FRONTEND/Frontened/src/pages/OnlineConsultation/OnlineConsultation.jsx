import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaComments, FaPrescriptionBottleAlt, FaShieldAlt, FaVideo } from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import fallbackDoctorImage from "../../assets/images/doc3.png";
import "./OnlineConsultation.css";

const readJsonResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("Backend API is not returning JSON. Please restart the backend server.");
  }

  return response.json();
};

const OnlineConsultation = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
          credentials: "include",
        });
        const data = await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(data.message || "Unable to load consultation.");
        }

        setAppointment(data.appointment);
      } catch (err) {
        setError(err.message || "Unable to load consultation.");
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [appointmentId]);

  const doctor = appointment?.doctorId;

  return (
    <>
      <Navbar />
      <main className="online-consultation-page">
        <div className="online-consultation-wrap">
          {loading && <div className="consultation-skeleton" />}

          {!loading && error && (
            <section className="consultation-card consultation-error">
              <h1>Consultation Not Available</h1>
              <p>{error}</p>
              <Link to="/find-doctor">Back to Doctors</Link>
            </section>
          )}

          {!loading && appointment && (
            <>
              <section className="consultation-hero">
                <div>
                  <p className="consultation-eyebrow">Online Consultation Room</p>
                  <h1>{doctor?.name}</h1>
                  <span>
                    {appointment.appointmentDate} at {appointment.appointmentTime} | {appointment.status}
                  </span>
                </div>
                <Link to="/find-doctor">Book Another Doctor</Link>
              </section>

              <section className="consultation-layout">
                <article className="video-room-card">
                  <div className="video-frame">
                    <FaVideo />
                    <h2>Video consultation room ready</h2>
                    <p>Room ID: {appointment.meetingRoomId}</p>
                    <button type="button">Start Video Call</button>
                  </div>
                </article>

                <aside className="consultation-side">
                  <div className="consultation-card doctor-mini-card">
                    <img src={doctor?.image || fallbackDoctorImage} alt={doctor?.name} />
                    <div>
                      <h3>{doctor?.name}</h3>
                      <p>{doctor?.specialization}</p>
                      <span>{doctor?.hospitalName}</span>
                    </div>
                  </div>

                  <div className="consultation-card consultation-tools">
                    <h3>Included Services</h3>
                    <span>
                      <FaShieldAlt /> Secure encrypted consultation
                    </span>
                    <span>
                      <FaPrescriptionBottleAlt /> Digital prescription after visit
                    </span>
                    <span>
                      <FaComments /> Chat support enabled
                    </span>
                  </div>
                </aside>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OnlineConsultation;
