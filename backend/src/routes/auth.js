import express from "express";
import { signup, login, me, logout, refresh } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", me);
router.post("/logout", logout);
router.post("/refresh", refresh);
export default router;
