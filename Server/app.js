import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import registerRouter from "./routes/registerRouter.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

connectDB();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// app.use("/register", registerRouter);

app.listen(PORT);
