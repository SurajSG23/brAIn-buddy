import express from "express";
import projectModel from "../models/project.model.js";

const router = express.Router();

router.post("/addproject", async (req, res) => {
  try {
    const { user, originalPDF, convertedPDF } = req.body;
    console.log(user, originalPDF);
    const updatedUser = await projectModel.create({
      user,
      originalPDF,
      convertedPDF,
    });
    console.log(updatedUser);
    res.send(updatedUser);
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
});

export default router;