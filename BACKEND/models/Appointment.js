const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    consultationType: { type: String, enum: ["Online", "Offline"], required: true },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
    meetingRoomId: { type: String, default: "" },
    meetingLink: { type: String, default: "" },
    prescriptionStatus: { type: String, enum: ["Not Generated", "Generated"], default: "Not Generated" },
    chatEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
