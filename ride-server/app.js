import express from "express";
import cors from "cors";
import morgan from "morgan";

//import routes
import { userRouter, rideRouter } from "./routes/routes.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes for app
app.get("/", (req, res) => {
    res.status(201).json({
        message: "Welcome to the Ride Server API",
        status: "success"
    });
});
app.use("/api/user", userRouter);
app.use("/api/ride", rideRouter);


export default app;