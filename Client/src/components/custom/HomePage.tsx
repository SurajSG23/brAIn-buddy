"use client";

import "../../lib/setupPdfWorker.ts";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/card";
import { FiUpload, FiPlus, FiFileText } from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import axios from "axios";
import { toast } from "react-toastify";
import { getDocument } from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import { MultiStepLoader as Loader } from "../ui/multi-step-loader";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPenFancy, FaPodcast, FaQuestionCircle } from "react-icons/fa";
import PodcastPrompt from "../../gemini/PodcastPrompt.ts";
import { AIchatSession } from "../../gemini/AiModel.ts";

const loadingStates = [
  { text: "Uploading your PDF..." },
  { text: "Creating your personalized podcast..." },
  { text: "Generating aptitude questions for you..." },
  { text: "Saving your project..." },
];

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [projects, setProjects] = useState<
    { id: string; name: string; date: string; url: string }[]
  >([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [user, setUser] = useState<{
    displayName: string;
    email: string;
  } | null>(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const handleCreateProject = () => {
    setIsCreating(true);
  };

  const [select, setSelect] = useState(false);
  const [projectID, setProjectID] = useState("");

  const fetchProjects = async (id: string) => {
    if (!id) {
      console.error("User ID is not available.");
      return;
    }
    setLoadingPage(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/project/getprojects/${id}`,
        { withCredentials: true }
      );
      const projectsData = response.data.map(
        (project: {
          _id: string;
          title: string;
          originalPDF: string;
          createdAt: string;
        }) => ({
          id: project._id,
          name: project.title,
          date: new Date(project.createdAt).toLocaleDateString(),
          url: project.originalPDF,
        })
      );
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingPage(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }
    setLoadingPage(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/project/deleteproject/${id}`,
        { withCredentials: true }
      );
      toast.success("Project deleted successfully!");
      fetchProjects(userId);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setConfirmDelete(false);
      setLoadingPage(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    try {
      const file = e.target.files?.[0];

      if (!file || file.type !== "application/pdf") {
        toast.error("Please upload a valid PDF file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("PDF must be less than 5MB.");
        return;
      }

      // Upload PDF to ImageKit
      let pdfUrl = "";
      let pdfID = "";
      try {
        const formData = new FormData();
        formData.append("pdf", file);

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/uploadimagekit/upload-pdf`,
          formData,
          { withCredentials: true }
        );

        pdfUrl = response.data.data.url;
        pdfID = response.data.data.fileId;
      } catch (error) {
        toast.error("Failed to upload PDF to server.");
        throw error;
      }

      // Extract text from PDF
      let fullText = "";
      let podcastURL = "";
      try {
        const loadingTask = getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();

          const pageText = content.items
            .filter((item): item is TextItem => "str" in item)
            .map((item) => item.str)
            .join(" ");

          fullText += pageText + "\n";
        }

        // Generate a podcast
        const result = await AIchatSession.sendMessage(
          PodcastPrompt.replace("###", fullText)
        );

        const GeminiPodcast =
          result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const blob = new Blob([GeminiPodcast], { type: "text/plain" });

        const formData2 = new FormData();
        formData2.append("file", blob, "podcast-text.txt");
        formData2.append(
          "upload_preset",
          import.meta.env.VITE_CLOUD_PRESET_NAME
        );

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/auto/upload`,
          formData2
        );
        podcastURL = cloudinaryResponse.data.secure_url;
      } catch (error) {
        toast.error("Failed to extract text from PDF.");
        throw error;
      }

      // Upload extracted text to Cloudinary
      let textFileUrl = "";
      try {
        const blob = new Blob([fullText], { type: "text/plain" });

        const formData2 = new FormData();
        formData2.append("file", blob, `${title}.txt`);
        formData2.append(
          "upload_preset",
          import.meta.env.VITE_CLOUD_PRESET_NAME
        );

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/auto/upload`,
          formData2
        );

        textFileUrl = cloudinaryResponse.data.secure_url;
      } catch (error) {
        toast.error("Failed to upload extracted text to server.");
        throw error;
      }

      // Save project info to backend
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/project/addproject`,
          {
            user: userId,
            originalPDF: pdfUrl,
            convertedPDF: textFileUrl,
            title: title.charAt(0).toUpperCase() + title.slice(1),
            fileIdFromImageKit: pdfID,
            podcastURL: podcastURL,
          },
          { withCredentials: true }
        );

        setProjects([]);
        toast.success("Project created successfully!");
      } catch (error) {
        toast.error("Failed to create project. Please try again.");
        throw error;
      }
    } catch (error) {
      console.error("❌ Something went wrong:", error);
    } finally {
      setTitle("");
      fetchProjects(userId);
      setIsCreating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoadingPage(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(
        user
          ? { displayName: user.displayName || "", email: user.email || "" }
          : null
      );

      if (user?.email) {
        try {
          const userFound = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/register/getuser/${
              user.email
            }`,
            { withCredentials: true }
          );
          setUserId(userFound.data._id);

          fetchProjects(userFound.data._id);
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoadingPage(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const openProject = async (id: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/project/openproject/${id}`,
        { withCredentials: true }
      );
      navigate("/editpage", { replace: true });
    } catch (error) {
      console.error("Error opening project:", error);
    }
  };

  const openProject2 = async (id: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/project/openproject/${id}`,
        { withCredentials: true }
      );
      navigate("/podcast", { replace: true });
    } catch (error) {
      console.error("Error opening project:", error);
    }
  };

  const openProject3 = async (id: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/project/openproject/${id}`,
        { withCredentials: true }
      );
      navigate("/testpage", { replace: true });
    } catch (error) {
      console.error("Error opening project:", error);
    }
  };

  if (loadingPage) {
    return (
      <>
        <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-99 ">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-transparent border-t-orange-500 border-b-orange-500 rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (confirmDelete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brain-black relative">
        <div className="relative space-y-1 w-full max-w-md mx-auto p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 shadow-xl flex flex-col justify-center items-center text-white text-center">
          <h2 className="font-bold text-xl">
            Are you sure you want to permanently delete this project?
          </h2>
          <div className="pt-6 text-center flex gap-3">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-8 py-3 rounded-xl bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-orange-500/25 cursor-pointer"
            >
              No
            </button>

            <button
              onClick={() => deleteProject(projectID)}
              className="px-8 py-3 rounded-xl bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-orange-500/25 cursor-pointer"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (select) {
    return (
      <div className="flex w-full flex-col items-center justify-center min-h-screen bg-zinc-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />

        <div className="relative space-y-1 w-full max-w-md mx-auto p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 shadow-xl">
          <div
            onClick={() => openProject(projectID)}
            className="group flex items-center gap-4 p-4 rounded-xl hover:bg-orange-500/10 transition-all duration-300 cursor-pointer"
          >
            <div className="p-3 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
              <FaPenFancy size={24} className="text-orange-500" />
            </div>
            <span className="text-lg font-medium text-white group-hover:text-orange-500 transition-colors">
              Create smart notes
            </span>
          </div>

          <div
            onClick={() => openProject2(projectID)}
            className="group flex items-center gap-4 p-4 rounded-xl hover:bg-orange-500/10 transition-all duration-300 cursor-pointer"
          >
            <div className="p-3 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
              <FaPodcast size={24} className="text-orange-500" />
            </div>
            <span className="text-lg font-medium text-white group-hover:text-orange-500 transition-colors">
              Tune into a podcast
            </span>
          </div>

          <div
            onClick={() => openProject3(projectID)}
            className="group flex items-center gap-4 p-4 rounded-xl hover:bg-orange-500/10 transition-all duration-300 cursor-pointer"
          >
            <div className="p-3 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
              <FaQuestionCircle size={24} className="text-orange-500" />
            </div>
            <span className="text-lg font-medium text-white group-hover:text-orange-500 transition-colors">
              Challenge yourself with a test
            </span>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => setSelect(false)}
              className="px-5 py-2 rounded-xl bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-orange-500/25 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 w-full">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading && (
          <Loader
            loadingStates={loadingStates}
            loading={loading}
            duration={4000}
          />
        )}

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome {user ? user.displayName : ""} to br
            <span className="text-orange-500">AI</span>n buddy!
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Upload your study materials and get AI-powered answers to your
            questions.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Your Projects</h3>
            <Button
              onClick={handleCreateProject}
              className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
            >
              <FiPlus /> New Project
            </Button>
          </div>

          {isCreating && (
            <Card className="p-8 bg-gray-800/70 shadow-lg mb-8">
              <div className="text-center">
                <div className="w-full justify-center items-center text-white">
                  <input
                    type="text"
                    className="w-full p-3 mb-3 text-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400 text-base"
                    placeholder="Add project title"
                    required
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>

                {title && (
                  <>
                    <p className="text-gray-200 mt-8 mb-4">
                      Upload a PDF file that contains your study material.
                    </p>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-500 rounded-lg p-12 mb-6 hover:border-orange-500 transition-colors">
                        <div className="text-orange-500 text-5xl mb-4 flex justify-center">
                          <FiUpload />
                        </div>
                        <p className="text-gray-300">Click to upload</p>
                        <p className="text-gray-400 text-sm">
                          PDF files only (max 5MB)
                        </p>
                      </div>
                    </label>
                  </>
                )}

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="border-gray-500 text-gray-300 hover:text-white hover:border-white cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 && !isCreating ? (
              <Card className="col-span-full p-12 text-center bg-gray-800/70 shadow-lg">
                <div className="text-orange-500 text-5xl mb-4 flex justify-center">
                  <FiFileText />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  No projects yet
                </h4>
                <p className="text-gray-300 mb-6">
                  Create your first project by uploading a study material
                </p>
                <Button
                  onClick={handleCreateProject}
                  className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                >
                  <FiPlus /> New Project
                </Button>
              </Card>
            ) : (
              projects.map((project) => (
                <>
                  <Card
                    key={project.id}
                    className="bg-gray-800/70 hover:border-orange-500 transition-all duration-300 shadow-lg p-6 cursor-pointer hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-orange-500 text-xl">
                        <FiFileText />
                      </div>
                      <span className="text-gray-400 text-sm">
                        {project.date}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {project.name}
                    </h4>
                    <div className="mt-6 text-[14px] flex justify-between items-center">
                      <p
                        className="flex items-center gap-1 cursor-pointer text-gray-500 hover:text-red-700 duration-200 transition-all ease-in-out transform hover:scale-110"
                        onClick={() => {
                          setProjectID(project.id);
                          setConfirmDelete(true);
                        }}
                      >
                        <FaTrash className="text-sm" />
                        <span className="">Delete</span>
                      </p>

                      <p
                        onClick={() => {
                          setProjectID(project.id);
                          setSelect(true);
                        }}
                        className="text-orange-500 text-lg hover:text-orange-700 cursor-pointer transition-all duration-200 ease-in-out font-semibold"
                      >
                        <span>Open Project →</span>
                      </p>
                    </div>
                  </Card>
                </>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
