import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import registerRouter from "./routes/register.route.js";
import uploadRouter from "./routes/uploadimagekit.route.js";
import projectRouter from "./routes/project.route.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://brainbuddy.vercel.app", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// API routes
app.use("/register", registerRouter);
app.use("/uploadimagekit", uploadRouter);
app.use("/project", projectRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
