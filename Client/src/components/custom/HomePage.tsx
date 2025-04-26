import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/card";
import { FiUpload, FiPlus, FiFileText } from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import axios from "axios";
import { toast } from "react-toastify";

const HomePage = () => {
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
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return 
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("PDF must be less than 5MB.");
      return 
    }

    const formData = new FormData();
    formData.append("pdf", file);
   
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/uploadimagekit/upload-pdf`,
        formData
      );

      const pdfUrl = response.data.data.url;

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register/addproject`,
        {
          user: userId,
          originalPDF: pdfUrl,
        }
      );
      setProjects([])
      console.log("✅ userid:", userId);
      console.log("✅ Project created:", res.data);
      toast.success("Project created successfully!");
    } catch (error) {
      toast.error("Failed to upload PDF. Please try again.");
      console.error("❌ Upload failed:", error);
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
  }, [auth]);

  return (
    <div className="min-h-screen bg-zinc-900 w-full">
      <main className="max-w-7xl mx-auto px-6 py-12">
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
