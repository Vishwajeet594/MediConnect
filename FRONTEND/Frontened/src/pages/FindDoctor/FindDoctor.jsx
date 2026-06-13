import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import fallbackDoctorImage from "../../assets/images/doc3.png";
import "./FindDoctor.css";

const readJsonResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("Backend API is not returning JSON. Please restart the backend server.");
  }

  return response.json();
};

const FindDoctor = () => {
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        const data = await readJsonResponse(response);
        if (!response.ok) {
          throw new Error(data.message || "Unable to load doctors.");
        }
        setDoctors(data.doctors || []);
      } catch (err) {
        setError(err.message || "Unable to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const categories = useMemo(() => {
    const specializations = doctors.map((doc) => doc.specialization).filter(Boolean);
    return ["All", ...new Set(specializations)];
  }, [doctors]);

  const filteredDoctors = doctors.filter((doc) => {
    return (
      (selected === "All" || doc.specialization === selected) &&
      doc.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <Navbar />

      <div className="container-find-doctor">


        <div className="filter-find-doctor">

          <input
            type="text"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {categories.map((cat) => (
            <button
              key={cat}
              className={selected === cat ? "active" : ""}
              onClick={() => setSelected(cat)}
            >
              {cat}
            </button>
          ))}

        </div>

        {/* RIGHT CARDS */}
        <div className="cards-find-doctor">
          {loading &&
            Array.from({ length: 8 }).map((_, index) => (
              <div className="card-find-doctor skeleton-card-find-doctor" key={index}>
                <div className="skeleton-image-find-doctor" />
                <div className="card-info-find-doctor">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ))}

          {!loading && error && (
            <div className="doctor-error-find-doctor">{error}</div>
          )}

          {!loading && !error && filteredDoctors.length === 0 && (
            <div className="doctor-error-find-doctor">No doctors found for your search.</div>
          )}

          {filteredDoctors.map((doc) => (
            <div className="card-find-doctor" key={doc._id}>
              
              {/* IMAGE */}
              <div className="image-container-find-doctor">
                <img src={doc.image || fallbackDoctorImage} alt={doc.name} />
              </div>

              {/* INFO */}
              <div className="card-info-find-doctor">
                <p className="status-find-doctor">
                  <span className="dot-find-doctor"></span> Available
                </p>

                <h3>{doc.name}</h3>
                <p>{doc.specialization}</p>

                <button
                  className="book-btn-find-doctor"
                  onClick={() => navigate(`/doctors/${doc._id}`)}
                >
                  Book Appointment
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      <Footer />
    </>
  );
};

export default FindDoctor;
