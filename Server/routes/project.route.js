import express from "express";
import projectModel from "../models/project.model.js";
import imagekit from "../config/imagekit.config.js";
const router = express.Router();

router.post("/addproject", async (req, res) => {
  try {
    const { user, originalPDF, convertedPDF, title, fileIdFromImageKit } =
      req.body;
    console.log(user, originalPDF);
    const updatedUser = await projectModel.create({
      user,
      originalPDF,
      convertedPDF,
      title,
      fileIdFromImageKit,
    });
    console.log(updatedUser);
    res.send(updatedUser);
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
});

router.get("/getprojects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await projectModel
      .find({ user: id })
      .sort({ createdAt: -1 });
    res.send(projects);
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
});

router.delete("/deleteproject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await projectModel.findByIdAndDelete(id);

    if (deletedProject && deletedProject.fileIdFromImageKit) {
      await imagekit.deleteFile(deletedProject.fileIdFromImageKit);
    }

    res.send(deletedProject);
  } catch (error) {
    console.error("Error while deleting project:", error);
    res.json({ message: error.message, status: 500 });
  }
});

export default router;
