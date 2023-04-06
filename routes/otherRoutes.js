import express from "express";
import {
  contact,
  courseRequest,
  getDashboardStats,
} from "../controllers/otherController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// contact form

router.route("/contact").post(contact);

// request form

router.route("/courserequest").post(courseRequest);

// Get admin board stats

router.route("/dashboard").get(getDashboardStats);

export default router;
