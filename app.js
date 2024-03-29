import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cors from "cors";

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
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

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

app.get("/", (req, res) => {
  res.send(
    `<h1>Site is Working. Click <a href=${process.env.FRONTEND_URL}> to visit frontend</a></h1>`
  );
});

app.use(ErrorMiddleware);
