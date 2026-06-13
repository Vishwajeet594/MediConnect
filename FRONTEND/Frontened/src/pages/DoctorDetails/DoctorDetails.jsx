import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaCar,
  FaClock,
  FaComments,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPrescriptionBottleAlt,
  FaShieldAlt,
  FaStar,
  FaVideo,
} from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import fallbackDoctorImage from "../../assets/images/doc3.png";
import { useAuth } from "../../context/AuthContext";
import "./DoctorDetails.css";

const formatDateLabel = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const readJsonResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("Backend API is not returning JSON. Please restart the backend server.");
  }

  return response.json();
};

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [selectedType, setSelectedType] = useState("Online");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadDoctor = async () => {
      setLoading(true);
      setError("");
      setSuccess("");
      setBookedAppointment(null);
      setNotFound(false);

      try {
        const response = await fetch(`/api/doctors/${id}`);
        const data = await readJsonResponse(response);

        if (response.status === 404) {
          setNotFound(true);
          setDoctor(null);
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Unable to load doctor details.");
        }

        setDoctor(data.doctor);
        setRecommended(data.recommended || []);
        setSelectedType(data.doctor.consultationTypes?.online ? "Online" : "Offline");
        setSelectedDate(data.doctor.availableSlots?.[0]?.date || "");
        setSelectedTime("");
      } catch (err) {
        setError(err.message || "Unable to load doctor details.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  const availableTimes = useMemo(() => {
    if (!doctor || !selectedDate) return [];
    return doctor.availableSlots?.find((item) => item.date === selectedDate)?.slots || [];
  }, [doctor, selectedDate]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedType || !selectedDate || !selectedTime) {
      setError("Please select consultation type, date, and time slot.");
      setSuccess("");
      return;
    }

    setBooking(true);
    setError("");
    setSuccess("");
    setBookedAppointment(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor._id,
          consultationType: selectedType,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
        }),
      });
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to book appointment.");
      }

      setSuccess(data.message || "Appointment booked successfully.");
      setBookedAppointment(data.appointment || null);
      setSelectedTime("");
    } catch (err) {
      setError(err.message || "Unable to book appointment.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="doctor-details-page">
          <div className="doctor-details-wrap">
            <div className="doctor-details-skeleton hero-skeleton" />
            <div className="doctor-layout">
              <div className="doctor-details-skeleton tall-skeleton" />
              <div className="doctor-details-skeleton booking-skeleton" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <Navbar />
        <main className="doctor-details-page">
          <section className="doctor-not-found">
            <h1>Doctor Not Found</h1>
            <p>We could not locate this doctor. Please choose another specialist from the doctors page.</p>
            <button type="button" onClick={() => navigate("/find-doctor")}>
              Back to Find Doctors
            </button>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="doctor-details-page">
        <div className="doctor-details-wrap">
          <section className="doctor-details-hero">
            <div>
              <p className="doctor-eyebrow">Doctor Profile</p>
              <h1>Book Appointment with {doctor.name}</h1>
              <p>Choose online or clinic consultation with a trusted MediConnect specialist.</p>
            </div>
            <Link to="/find-doctor">Find Another Doctor</Link>
          </section>

          {error && <div className="doctor-alert doctor-alert-error">{error}</div>}
          {success && (
            <div className="doctor-alert doctor-alert-success">
              <span>{success}</span>
              {bookedAppointment?.meetingLink && (
                <Link to={bookedAppointment.meetingLink} className="join-consultation-link">
                  Join Online Consultation
                </Link>
              )}
            </div>
          )}

          <div className="doctor-layout">
            <section className="doctor-main-column">
              <article className="doctor-profile-card">
                <div className="doctor-photo">
                  <img src={doctor.image || fallbackDoctorImage} alt={doctor.name} />
                </div>

                <div className="doctor-profile-info">
                  <div className="doctor-profile-heading">
                    <div>
                      <p>{doctor.specialization}</p>
                      <h2>{doctor.name}</h2>
                      <span>
                        {doctor.qualification} | {doctor.experience} experience
                      </span>
                    </div>
                    <div className="online-badge">
                      <span />
                      {doctor.onlineStatus}
                    </div>
                  </div>

                  <div className="doctor-stats-grid">
                    <div>
                      <small>Rating</small>
                      <strong>
                        <FaStar /> {Number(doctor.rating).toFixed(1)}
                      </strong>
                      <span>{doctor.patientsTreated}+ patients treated</span>
                    </div>
                    <div>
                      <small>Consultation fee</small>
                      <strong>Rs. {doctor.fee}</strong>
                      <span>{doctor.hospitalName}</span>
                    </div>
                  </div>

                  <div className="doctor-meta-grid">
                    <span>
                      <FaMapMarkerAlt /> {doctor.location}
                    </span>
                    <span>Languages: {doctor.languages?.join(", ")}</span>
                  </div>
                </div>
              </article>

              <article className="doctor-section-card">
                <h3>About Doctor</h3>
                <p>{doctor.about}</p>
                <div className="expertise-grid">
                  {doctor.expertise?.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>

              <div className="features-grid">
                <article className="doctor-section-card">
                  <h3>Online Consultation Features</h3>
                  <div className="feature-list-details">
                    <span>
                      <FaVideo /> Video call consultation
                    </span>
                    <span>
                      <FaShieldAlt /> Secure consultation
                    </span>
                    <span>
                      <FaPrescriptionBottleAlt /> Digital prescription
                    </span>
                    <span>
                      <FaComments /> Chat support
                    </span>
                  </div>
                </article>

                <article className="doctor-section-card">
                  <h3>Offline Consultation Features</h3>
                  <div className="feature-list-details">
                    <span>
                      <FaMapMarkerAlt /> {doctor.clinicAddress}
                    </span>
                    <a href={doctor.mapUrl} target="_blank" rel="noreferrer">
                      <FaMapMarkerAlt /> Google Maps location
                    </a>
                    <span>
                      <FaPhoneAlt /> {doctor.contactNumber}
                    </span>
                    <span>
                      <FaClock /> {doctor.clinicTimings}
                    </span>
                    <span>
                      <FaCar /> {doctor.parking}
                    </span>
                  </div>
                </article>
              </div>

              <article className="doctor-section-card">
                <h3>Patient Reviews</h3>
                <div className="reviews-list">
                  {doctor.reviews?.map((review) => (
                    <div className="review-card" key={`${review.patientName}-${review.date}`}>
                      <div className="review-head">
                        <div className="review-avatar">{review.patientName.charAt(0)}</div>
                        <div>
                          <strong>{review.patientName}</strong>
                          <span>{review.date}</span>
                        </div>
                      </div>
                      <div className="review-stars">
                        {Array.from({ length: review.rating }).map((_, index) => (
                          <FaStar key={index} />
                        ))}
                      </div>
                      <p>{review.text}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <aside className="doctor-side-column">
              <article className="booking-card">
                <h3>Appointment Booking</h3>
                <p>Select consultation type, date, and available time slot.</p>

                <div className="booking-group">
                  <label>Consultation Type</label>
                  <div className="booking-toggle">
                    <button
                      type="button"
                      className={selectedType === "Online" ? "active" : ""}
                      disabled={!doctor.consultationTypes?.online}
                      onClick={() => setSelectedType("Online")}
                    >
                      Online Consultation
                    </button>
                    <button
                      type="button"
                      className={selectedType === "Offline" ? "active" : ""}
                      disabled={!doctor.consultationTypes?.offline}
                      onClick={() => setSelectedType("Offline")}
                    >
                      Offline Consultation
                    </button>
                  </div>
                </div>

                <div className="booking-group">
                  <label>Date Selection</label>
                  <div className="date-grid">
                    {doctor.availableSlots?.slice(0, 7).map((item) => (
                      <button
                        type="button"
                        key={item.date}
                        className={selectedDate === item.date ? "active" : ""}
                        onClick={() => {
                          setSelectedDate(item.date);
                          setSelectedTime("");
                        }}
                      >
                        {formatDateLabel(item.date)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="booking-group">
                  <label>Time Slot Selection</label>
                  <div className="slot-grid">
                    {availableTimes.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        className={selectedTime === slot ? "active" : ""}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="appointment-summary">
                  <h4>Appointment Summary</h4>
                  <div>
                    <span>Doctor Name</span>
                    <strong>{doctor.name}</strong>
                  </div>
                  <div>
                    <span>Consultation Type</span>
                    <strong>{selectedType}</strong>
                  </div>
                  <div>
                    <span>Selected Date</span>
                    <strong>{selectedDate ? formatDateLabel(selectedDate) : "Not selected"}</strong>
                  </div>
                  <div>
                    <span>Selected Time</span>
                    <strong>{selectedTime || "Not selected"}</strong>
                  </div>
                  <div>
                    <span>Fee</span>
                    <strong>Rs. {doctor.fee}</strong>
                  </div>
                </div>

                <button className="book-final-btn desktop-book-btn" type="button" disabled={booking} onClick={handleBooking}>
                  {booking ? "Booking..." : "Book Appointment"}
                </button>
              </article>

              <article className="recommended-card">
                <h3>Recommended Doctors</h3>
                {recommended.map((item) => (
                  <div className="recommended-doctor" key={item._id}>
                    <img src={item.image || fallbackDoctorImage} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.specialization}</span>
                      <small>
                        {item.experience} | Rs. {item.fee}
                      </small>
                      <Link to={`/doctors/${item._id}`}>Book Appointment</Link>
                    </div>
                  </div>
                ))}
              </article>
            </aside>
          </div>
        </div>

        <button className="book-final-btn mobile-book-btn" type="button" disabled={booking} onClick={handleBooking}>
          {booking ? "Booking..." : "Book Appointment"}
        </button>
      </main>
      <Footer />
    </>
  );
};

export default DoctorDetails;
