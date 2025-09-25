import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patient.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // your React app
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
// routes
app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend API is running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
