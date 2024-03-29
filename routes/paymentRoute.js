import express from "express";
import {
  buySubscription,
  cancelSubscription,
  getRazorPayKey,
  rijul,
  paymentVerification,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// buysubscription

router.route("/subscribe").get(isAuthenticated, buySubscription);

// verify payment and save reference in database
router.route("/paymentverification").post(isAuthenticated, paymentVerification);

// get razorpay key

router.route("/razorpaykey").get(getRazorPayKey);
router.route("/rijul").get(rijul);

router.route("");

// cancel subcription

router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);

export default router;
