const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const crypto = require("crypto");

const buildSlots = () => {
  const slots = ["09:30 AM", "10:30 AM", "11:45 AM", "02:00 PM", "04:15 PM", "06:00 PM"];
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      date: date.toISOString().slice(0, 10),
      slots,
    };
  });
};

const defaultDoctors = [
  {
    legacyId: 1,
    name: "Dr. Richard James",
    specialization: "General physician",
    qualification: "MBBS, MD - Internal Medicine",
    experience: "12 years",
    about:
      "Dr. Richard James is a trusted general physician focused on preventive healthcare, lifestyle disease management, and accurate primary diagnosis for families.",
    expertise: ["Diabetes care", "Fever and infections", "Hypertension", "Preventive health checks"],
    fee: 500,
    rating: 4.8,
    patientsTreated: 3200,
    hospitalName: "MediConnect Prime Clinic",
    location: "Sector 62, Noida",
    languages: ["English", "Hindi"],
    clinicAddress: "MediConnect Prime Clinic, A-21, Sector 62, Noida, Uttar Pradesh",
    mapUrl: "https://maps.google.com/?q=MediConnect%20Prime%20Clinic%20Noida",
    clinicTimings: "Mon - Sat, 9:00 AM - 7:00 PM",
    parking: "Basement parking available",
    contactNumber: "+91 98765 43210",
  },
  {
    legacyId: 2,
    name: "Dr. Emily Larson",
    specialization: "Gynecologist",
    qualification: "MBBS, MS - Obstetrics & Gynaecology",
    experience: "10 years",
    about:
      "Dr. Emily Larson provides compassionate women healthcare with expertise in maternity care, menstrual health, fertility counselling, and preventive screening.",
    expertise: ["Pregnancy care", "PCOS treatment", "Fertility counselling", "Women wellness"],
    fee: 700,
    rating: 4.9,
    patientsTreated: 2800,
    hospitalName: "MediConnect Women Care",
    location: "Indiranagar, Bengaluru",
    languages: ["English", "Hindi", "Kannada"],
    clinicAddress: "MediConnect Women Care, 14th Main Road, Indiranagar, Bengaluru",
    mapUrl: "https://maps.google.com/?q=MediConnect%20Women%20Care%20Bengaluru",
    clinicTimings: "Mon - Fri, 10:00 AM - 6:00 PM",
    parking: "Valet parking available",
    contactNumber: "+91 98765 43211",
  },
  {
    legacyId: 3,
    name: "Dr. Sarah Patel",
    specialization: "Dermatologist",
    qualification: "MBBS, MD - Dermatology",
    experience: "9 years",
    about:
      "Dr. Sarah Patel is a dermatologist specializing in acne, pigmentation, hair fall, allergy management, and evidence-led skin treatments.",
    expertise: ["Acne treatment", "Skin allergy", "Hair fall care", "Pigmentation therapy"],
    fee: 650,
    rating: 4.7,
    patientsTreated: 2400,
    hospitalName: "MediConnect Skin Studio",
    location: "Bandra West, Mumbai",
    languages: ["English", "Hindi", "Marathi"],
    clinicAddress: "MediConnect Skin Studio, Linking Road, Bandra West, Mumbai",
    mapUrl: "https://maps.google.com/?q=MediConnect%20Skin%20Studio%20Mumbai",
    clinicTimings: "Tue - Sun, 11:00 AM - 8:00 PM",
    parking: "Street and paid parking nearby",
    contactNumber: "+91 98765 43212",
  },
  {
    legacyId: 4,
    name: "Dr. Christopher Lee",
    specialization: "Pediatricians",
    qualification: "MBBS, DCH",
    experience: "11 years",
    about:
      "Dr. Christopher Lee offers child-friendly pediatric care for newborn wellness, immunisation, nutrition, growth tracking, and common childhood illnesses.",
    expertise: ["Child vaccination", "Newborn care", "Growth monitoring", "Child nutrition"],
    fee: 550,
    rating: 4.8,
    patientsTreated: 3600,
    hospitalName: "MediConnect Child Care",
    location: "Anna Nagar, Chennai",
    languages: ["English", "Hindi", "Tamil"],
    clinicAddress: "MediConnect Child Care, 2nd Avenue, Anna Nagar, Chennai",
    mapUrl: "https://maps.google.com/?q=MediConnect%20Child%20Care%20Chennai",
    clinicTimings: "Mon - Sat, 9:30 AM - 5:30 PM",
    parking: "Dedicated visitor parking",
    contactNumber: "+91 98765 43213",
  },
];

const reviewSet = [
  {
    patientName: "Ananya Sharma",
    rating: 5,
    text: "The consultation was calm, clear, and very professional. I received my prescription immediately after the visit.",
    date: "12 Jun 2026",
  },
  {
    patientName: "Rahul Mehta",
    rating: 5,
    text: "Booking was easy and the doctor explained every step with patience. The clinic staff was also helpful.",
    date: "08 Jun 2026",
  },
];

const ensureDoctors = async () => {
  const count = await Doctor.countDocuments();
  if (count === 0) {
    await Doctor.insertMany(
      defaultDoctors.map((doctor) => ({
        ...doctor,
        consultationTypes: { online: true, offline: true },
        onlineStatus: "Online",
        availableSlots: buildSlots(),
        reviews: reviewSet,
      }))
    );
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  await Doctor.updateMany(
    { $or: [{ availableSlots: { $size: 0 } }, { "availableSlots.0.date": { $lt: today } }] },
    { $set: { availableSlots: buildSlots() } }
  );
};

const findDoctor = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const doctor = await Doctor.findById(id);
    if (doctor) return doctor;
  }

  if (/^\d+$/.test(id)) {
    return Doctor.findOne({ legacyId: Number(id) });
  }

  return null;
};

const buildOnlineConsultation = (appointmentId) => {
  const meetingRoomId = `mediconnect-${crypto.randomBytes(4).toString("hex")}`;
  return {
    meetingRoomId,
    meetingLink: `/consultation/${appointmentId}`,
    prescriptionStatus: "Not Generated",
    chatEnabled: true,
  };
};

exports.getDoctors = async (req, res) => {
  try {
    await ensureDoctors();
    const doctors = await Doctor.find().sort({ legacyId: 1, rating: -1 });
    res.json({ doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch doctors." });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    await ensureDoctors();
    const doctor = await findDoctor(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const recommended = await Doctor.find({
      _id: { $ne: doctor._id },
      specialization: doctor.specialization,
    })
      .sort({ rating: -1 })
      .limit(4);

    const extraRecommended =
      recommended.length < 4
        ? await Doctor.find({ _id: { $nin: [doctor._id, ...recommended.map((item) => item._id)] } })
            .sort({ rating: -1 })
            .limit(4 - recommended.length)
        : [];

    res.json({ doctor, recommended: [...recommended, ...extraRecommended] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch doctor details." });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, consultationType, appointmentDate, appointmentTime } = req.body;

    if (!doctorId || !consultationType || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: "All appointment fields are required." });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const typeKey = consultationType.toLowerCase();
    if (!doctor.consultationTypes?.[typeKey]) {
      return res.status(400).json({ message: "Selected consultation type is not available." });
    }

    const dateSlots = doctor.availableSlots.find((item) => item.date === appointmentDate);
    if (!dateSlots || !dateSlots.slots.includes(appointmentTime)) {
      return res.status(400).json({ message: "Selected appointment slot is not available." });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      consultationType,
      appointmentDate,
      appointmentTime,
      status: "Confirmed",
    });

    if (consultationType === "Online") {
      const onlineConsultation = buildOnlineConsultation(appointment._id);
      appointment.meetingRoomId = onlineConsultation.meetingRoomId;
      appointment.meetingLink = onlineConsultation.meetingLink;
      appointment.prescriptionStatus = onlineConsultation.prescriptionStatus;
      appointment.chatEnabled = onlineConsultation.chatEnabled;
      await appointment.save();
    }

    res.status(201).json({ message: "Appointment booked successfully.", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create appointment." });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user._id,
    })
      .populate("doctorId", "name specialization qualification experience image hospitalName location")
      .populate("patientId", "fullName email phone");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json({ appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch appointment." });
  }
};
