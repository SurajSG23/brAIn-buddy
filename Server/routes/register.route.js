import express from "express";
import userModel from "../models/user.model.js";
import projectModel from "../models/project.model.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Register page1");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, name, profilepic } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      return res.json({ message: "User already exists", status: 400 });
    }
    const user2 = await userModel.create({
      email,
      name,
      profilepic,
    });
    res.send(user2);
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
});


router.get("/getuser/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found", status: 404 });
    }
    res.send(user);
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
});

export default router;
