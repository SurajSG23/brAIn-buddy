import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import registerRouter from "./routes/register.route.js";
import uploadRouter from "./routes/uploadimagekit.route.js";
import projectRouter from "./routes/project.route.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

connectDB();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
  
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://brainbuddy.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/register", registerRouter);
app.use("/uploadimagekit", uploadRouter);
app.use("/project", projectRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
