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

const loadingStates = [
  { text: "Uploading PDF..." },
  { text: "Extracting Text..." },
  { text: "Uploading Text File..." },
  { text: "Saving Project..." },
];

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [projects, setProjects] = useState<
    { id: string; name: string; date: string; url: string }[]
  >([]);
  const [user, setUser] = useState<{
    displayName: string;
    email: string;
  } | null>(null);

  const [userId, setUserId] = useState<string>("");

  const handleCreateProject = () => {
    setIsCreating(true);
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

      // 1. Upload PDF to ImageKit
      let pdfUrl = "";
      try {
        const formData = new FormData();
        formData.append("pdf", file);

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/uploadimagekit/upload-pdf`,
          formData
        );

        pdfUrl = response.data.data.url;
      } catch (error) {
        toast.error("Failed to upload PDF to server.");
        throw error;
      }

      // 2. Extract text from PDF
      let fullText = "";
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
      } catch (error) {
        toast.error("Failed to extract text from PDF.");
        throw error;
      }

      // 3. Upload extracted text to Cloudinary
      let textFileUrl = "";
      try {
        const blob = new Blob([fullText], { type: "text/plain" });

        const formData2 = new FormData();
        formData2.append("file", blob, "extracted-text.txt");
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

      // 4. Save project info to backend
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/uploadproject/addproject`,
          {
            user: userId,
            originalPDF: pdfUrl,
            convertedPDF: textFileUrl,
          }
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
      setLoading(false);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setUser(
        user
          ? { displayName: user.displayName || "", email: user.email || "" }
          : null
      );
      try {
        if (user?.email) {
          const userFound = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/register/getuser/${user.email}`
          );
          setUserId(userFound.data._id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 w-full">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading && (
          <Loader
            loadingStates={loadingStates}
            loading={loading}
            duration={2000}
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
                <h4 className="text-xl font-semibold text-white mb-4">
                  Upload Study Material
                </h4>
                <p className="text-gray-300 mb-8">
                  Upload a PDF file that contains your study material
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

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="border-gray-500 text-gray-300 hover:text-white hover:border-white"
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
                  <p className="text-gray-300 text-sm mb-4">
                    Click to open this study project and ask questions
                  </p>
                  <div className="mt-4 text-orange-500 text-sm flex justify-end">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Project →
                    </a>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
