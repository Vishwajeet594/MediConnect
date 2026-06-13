const express = require("express");
const { getDoctors, getDoctorById, createAppointment, getAppointmentById } = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorById);
router.post("/appointments", authMiddleware, createAppointment);
router.get("/appointments/:id", authMiddleware, getAppointmentById);

module.exports = router;
