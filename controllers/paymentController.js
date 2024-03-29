import { catchAsyncError } from "../middlewares/catchAssyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { instance } from "../server.js";
import { User } from "../models/User.js";
import { Payment } from "../models/payment.js";
import crypto from "crypto";

export const buySubscription = catchAsyncError(async (req, res, next) => {
  console.log("id ", req.cookies.token);
  console.log("here");
  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return next(new ErrorHandler("Admin can't buy subscription"));
  }

  const plan_id = process.env.PLAN_ID || "plan_LVsaNe6WB56H44";
  const subscription = await instance.subscriptions.create({
    plan_id: plan_id,
    customer_notify: 1,
    total_count: 12,
  });

  console.log("subscription before", user);

  user.subscription.id = subscription.id;

  console.log("subscription", user.subscription.id);
  console.log("subscription after", user);

  user.subscription.status = subscription.status;

  user.save();

  res.status(201).json({
    success: true,
    subscriptionId: subscription.id,
  });
});

export const paymentVerification = catchAsyncError(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
    req.body;

  const user = await User.findById(req.user._id);

  const subscription_id = user.subscription.id;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
    .digest("hex");

  const isAuthentic = generated_signature === razorpay_signature;

  if (!isAuthentic)
    return res.redirect(`${process.env.FRONTEND_URL}/paymentfailed`);

  await Payment.create({
    razorpay_signature,
    razorpay_payment_id,
    razorpay_subscription_id,
  });

  user.subscription.status = "active";

  console.log("reached");

  await user.save();

  console.log(
    `${process.env.FRONTEND_URL}/paymentsucess?reference=${razorpay_payment_id}`
  );

  res.redirect(`${process.env.FRONTEND_URL}/paymentsuccess`);
});

export const getRazorPayKey = catchAsyncError(async (req, res, next) => {
  console.log("i am there");
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_API_KEY,
  });
});

export const rijul = catchAsyncError(async (req, res, next) => {
  console.log("i am there");
  res.status(200).json({
    success: true,
    message: "yes i am there",
  });
});

export const cancelSubscription = catchAsyncError(async (req, res, next) => {
  console.log("cancel sub");
  const user = await User.findById(req.user._id);

  console.log("user", user);

  const subscriptionId = user.subscription.id;

  // razorpay_subscription_id

  console.log("subscriptionId", subscriptionId);

  let refund = false;

  await instance.subscriptions.cancel(subscriptionId);

  const payment = await Payment.findOne({
    razorpay_subscription_id: subscriptionId,
  });

  console.log("payment", payment);

  const gap = Date.now() - payment.createdAt;

  const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;

  if (refundTime > gap) {
    await instance.payments.refund(payment.razorpay_payment_id);
  } else {
    refund = true;
  }

  await payment.remove();

  user.subscription.id = undefined;
  user.subscription.status = undefined;

  console.log("end", refund);

  await user.save();

  await res.status(200).json({
    success: true,
    message: refund
      ? "Subscription cancelled , You will receive full refund withi 7 days. "
      : "Subscription cancelled , Now refund initiated as subscription was cancelled after 7 days",
  });
});
