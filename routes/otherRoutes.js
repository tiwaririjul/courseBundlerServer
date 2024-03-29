import express from "express";
import {
  contact,
  courseRequest,
  getDashboardStats,
  getWork,
} from "../controllers/otherController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// contact form

router.route("/contact").post(contact);

router.route("/bhai").get(getWork);

// request form

router.route("/courserequest").post(courseRequest);

// Get admin board stats

router.route("/dashboard").get(getDashboardStats);

export default router;
