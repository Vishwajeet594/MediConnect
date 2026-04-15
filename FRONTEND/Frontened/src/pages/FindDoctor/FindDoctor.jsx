import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import doctors from "./Doctor-data";
import "./FindDoctor.css";

const categories = [
  "All",
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
];

const FindDoctor = () => {
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");

  const filteredDoctors = doctors.filter((doc) => {
    return (
      (selected === "All" || doc.type === selected) &&
      doc.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <Navbar />

      <div className="container-find-doctor">

        {/* LEFT FILTER */}
        <div className="filter-find-doctor">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* CATEGORY */}
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
          {filteredDoctors.map((doc) => (
            <div className="card-find-doctor" key={doc.id}>
              
              {/* IMAGE */}
              <div className="image-container-find-doctor">
                <img src={doc.image} alt={doc.name} />
              </div>

              {/* INFO */}
              <div className="card-info-find-doctor">
                <p className="status-find-doctor">
                  <span className="dot-find-doctor"></span> Available
                </p>

                <h3>{doc.name}</h3>
                <p>{doc.type}</p>

                <button className="book-btn-find-doctor">Book Appointment</button>
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