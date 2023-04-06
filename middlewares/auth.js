import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAssyncError.js ";
import { User } from "../models/User.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  console.log("logged in token", token);

  if (!token) return next(new ErrorHandler("Not Logged In", 401));

  const decoded = jwt.verify(
    token,
    "fgnfgrygdhucrjehfuyjehgurjyhdgfujhbfhbrgnfjbgjrbfhg"
  );

  console.log("decoded data", decoded);

  req.user = await User.findById(decoded._id);

  next();
});

export const authorizeRoles = (req, res, next) => {
  console.log(req.user);
  if (req.user.role != "admin") {
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to access this resource`,
        403
      )
    );
  }

  next();
};

export const authorizeSubscribers = (req, res, next) => {
  console.log(req.user);
  if (req.user.subscription.status !== "active" && req.user.role !== "admin") {
    return next(
      new ErrorHandler(`Only Subscriber can access this resource`, 403)
    );
  }

  next();
};
