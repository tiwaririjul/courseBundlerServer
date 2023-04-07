import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";

config({ path: "./config/config.env" });

const app = express();

// using middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

//Importing and using routes
import course from "./routes/courseRouter.js";
import user from "./routes/userRoutes.js";
import payment from "./routes/paymentRoute.js";
import other from "./routes/otherRoutes.js";
app.use("/api/v1", course);
app.use("/api/v1", user);
app.use("/api/v1", payment);
app.use("/api/v1", other);

export default app;

app.use(ErrorMiddleware);
