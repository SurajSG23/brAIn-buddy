import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled",
    },
    originalPDF: {
      type: String,
      required: true,
    },
    convertedPDF: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    fileIdFromImageKit: {
      type: String,
      required: true,
      default: null,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    podcastURL: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("project", projectSchema);
