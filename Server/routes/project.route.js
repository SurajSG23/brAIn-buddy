import express from "express";
import projectModel from "../models/project.model.js";
import imagekit from "../config/imagekit.config.js";
const router = express.Router();

router.post("/addproject", async (req, res) => {
  try {
    const {
      user,
      originalPDF,
      convertedPDF,
      title,
      fileIdFromImageKit,
      podcastURL,
    } = req.body;

    const updatedUser = await projectModel.create({
      user,
      originalPDF,
      convertedPDF,
      title,
      fileIdFromImageKit,
      podcastURL,
    });
    res.send(updatedUser);
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
});

router.post("/openproject/:id", async (req, res) => {
  try {
    await projectModel.findByIdAndUpdate(req.params.id, {
      isOpen: true,
    });
    res.send("success");
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
});

router.post("/closeproject/:id", async (req, res) => {
  try {
    await projectModel.findOneAndUpdate(
      {
        user: req.params.id,
        isOpen: true,
      },
      {
        isOpen: false,
      }
    );
    res.send("success");
  } catch (error) {
    res.json({ message: "No projects to close", status: 500 });
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

router.get("/", async (req, res) => {
  res.send("Project route");
});

router.get("/openedProject/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const project = await projectModel
      .findOne({ user: req.params.id })
      .sort({ updatedAt: -1 });
    res.send(project ? [project] : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
