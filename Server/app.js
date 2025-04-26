import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import registerRouter from "./routes/register.route.js";
import uploadRouter from "./routes/uploadimagekit.route.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"; // Import body-parser

connectDB();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Increase the max file upload size limit
app.use(bodyParser.json({ limit: "50mb" })); // Increase for base64 files (JSON requests)
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // For URL-encoded files (form requests)

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/register", registerRouter);
app.use("/uploadimagekit", uploadRouter);

app.listen(PORT);
