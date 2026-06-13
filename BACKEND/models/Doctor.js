const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    patientImage: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true },
    date: { type: String, required: true },
  },
  { _id: false }
);

const slotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    slots: { type: [String], default: [] },
  },
  { _id: false }
);

const DoctorSchema = new mongoose.Schema(
  {
    legacyId: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: String, required: true },
    image: { type: String, default: "" },
    about: { type: String, default: "" },
    expertise: { type: [String], default: [] },
    fee: { type: Number, required: true },
    rating: { type: Number, default: 4.8 },
    patientsTreated: { type: Number, default: 1200 },
    hospitalName: { type: String, default: "" },
    location: { type: String, default: "" },
    languages: { type: [String], default: ["English"] },
    onlineStatus: { type: String, enum: ["Online", "Offline"], default: "Online" },
    consultationTypes: {
      online: { type: Boolean, default: true },
      offline: { type: Boolean, default: true },
    },
    availableSlots: { type: [slotSchema], default: [] },
    clinicAddress: { type: String, default: "" },
    mapUrl: { type: String, default: "" },
    clinicTimings: { type: String, default: "" },
    parking: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    reviews: { type: [reviewSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
