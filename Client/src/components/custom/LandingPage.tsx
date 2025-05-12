import { Button } from "../ui/Button";
import {
  FaGoogle,
  FaRobot,
  FaBook,
  FaComments,
  FaQuestionCircle,
  FaLightbulb,
  FaPaperPlane,
  FaGraduationCap,
} from "react-icons/fa";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TextGenerateEffect from "../ui/text-generate-effect";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LandingPage = () => {
  useGSAP(() => {
    gsap.from(".card", {
      duration: 1,
      y: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/homepage");
      }
    });
  }, [auth, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const name = result.user.displayName;
      const email = result.user.email;
      const profilepic = result.user.photoURL;
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register/signin`,
        {
          name,
          email,
          profilepic,
        },
        { withCredentials: true }
      );
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Login failed:", error);
    } finally {
      navigate("/homepage");
    }
  };

  return (
    <div className="bg-[#1A1F2C] min-h-[screen] w-full ">
      <section className="relative pt-20 pb-40 overflow-hidden min-h-[80vh] flex justify-center items-center">
        <div className="absolute inset-0 z-0 opacity-20">
          <div
            className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/20 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
                <span className="text-white">Welcome to </span>
                <span className="text-white">
                  br
                  <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                    AI
                  </span>
                  n buddy
                </span>
              </h1>
              <TextGenerateEffect
                className="text-xl font-thin text-gray-500 pb-10 text-center"
                words="Upload your study materials and get instant AI-powered answers to all your questions."
              />

              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer p-6 text-lg rounded-xl flex items-center shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all mx-auto"
                onClick={() => {
                  handleGoogleLogin();
                }}
              >
                <FaGoogle />
                Sign in with Google
              </Button>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="card relative">
                <div className="w-72 h-72 md:w-80 md:h-80 bg-orange-300/20 rounded-full overflow-hidden flex items-center justify-center shadow-xl shadow-orange-500/10 ">
                  <div className="w-40 h-40 bg-orange-500/30 rounded-full flex items-center justify-center animate-pulse-slow">
                    <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center">
                      <img src="favicon.png" width={100} />
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 -right-4 w-24 h-24 bg-orange-500/20 rounded-full"></div>
                <div className="absolute -bottom-4 left-0 w-20 h-20 bg-orange-500/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Explore{" "}
              <span>
                br<span className="text-orange-500">AI</span>n buddy
              </span>{" "}
              Power
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your intelligent study companion that makes learning efficient and
              effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-black/60 rounded-xl p-8 shadow-lg border border-gray-700/20 hover:border-orange-500/30 transition-all cursor-pointer hover:scale-101">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                <FaBook className="text-orange-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Upload Study Material
              </h3>
              <p className="text-gray-300">
                Ask questions based on your study material and get instant
                answers.
              </p>
            </div>

            <div className="bg-black/60 rounded-xl p-8 shadow-lg border border-gray-700/20 hover:border-orange-500/30 transition-all cursor-pointer hover:scale-101">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                <FaComments className="text-orange-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Podcast</h3>
              <p className="text-gray-300">
                Listen to AI-generated podcasts that summarize your study
                materials in a clear and conversational way.
              </p>
            </div>

            <div className="bg-black/60 rounded-xl p-8 shadow-lg border border-gray-700/20 hover:border-orange-500/30 transition-all cursor-pointer hover:scale-101">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                <FaPaperPlane className="text-orange-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Get Personalized Tests
              </h3>
              <p className="text-gray-300">
                Automatically generate quizzes and tests based on your uploaded
                material to reinforce your understanding.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-brain-black min-h-[80vh] flex items-center justify-center ">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h2 className="text-4xl font-bold text-white mb-6">
                About{" "}
                <span>
                  br<span className="text-orange-500">AI</span>n buddy
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                brAIn buddy is designed for students and learners who want to
                maximize their study efficiency.
              </p>
              <p className="text-gray-400 mb-8">
                Our platform uses advanced artificial intelligence to process
                and understand your study materials, allowing you to get precise
                answers to your questions instead of searching through pages of
                text.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mr-3">
                    <FaGraduationCap className="text-orange-400" />
                  </div>
                  <span className="text-white">Boost Learning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mr-3">
                    <FaLightbulb className="text-orange-400" />
                  </div>
                  <span className="text-white">Save Time</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mr-3">
                    <FaQuestionCircle className="text-orange-400" />
                  </div>
                  <span className="text-white">Instant Answers</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="card w-80 h-80 md:w-96 md:h-96 bg-gray-800 rounded-2xl shadow-xl overflow-hidden bg-opacity-60 backdrop-blur-md border border-white/20 animate-float">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-4 left-4 right-4 h-6 bg-gray-700/30 rounded flex items-center px-3">
                      <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="absolute top-16 left-4 right-4 bottom-4">
                      <div className="h-24 bg-gray-700/20 rounded-lg mb-3 flex items-center px-4">
                        <div className="w-8 h-8 rounded-full bg-orange-500/30 mr-3 flex items-center justify-center">
                          <FaQuestionCircle className="text-orange-500 text-xs" />
                        </div>
                        <div className="text-left">
                          <div className="h-2 w-40 bg-white/30 rounded mb-2"></div>
                          <div className="h-2 w-28 bg-white/20 rounded"></div>
                        </div>
                      </div>
                      <div className="h-24 bg-orange-700/20 rounded-lg mb-3 flex items-center px-4">
                        <div className="w-8 h-8 rounded-full bg-orange-500/30 mr-3 flex items-center justify-center">
                          <FaRobot className="text-orange-500 text-xs" />
                        </div>
                        <div className="text-left">
                          <div className="h-2 w-40 bg-orange-400/30 rounded mb-2"></div>
                          <div className="h-2 w-28 bg-orange-400/20 rounded"></div>
                        </div>
                      </div>
                      <div className="h-24 bg-gray-700/20 rounded-lg mb-3 flex items-center px-4">
                        <div className="w-8 h-8 rounded-full bg-orange-500/30 mr-3 flex items-center justify-center">
                          <FaQuestionCircle className="text-orange-500 text-xs" />
                        </div>
                        <div className="text-left">
                          <div className="h-2 w-40 bg-white/30 rounded mb-2"></div>
                          <div className="h-2 w-28 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-orange-500/90 rounded-full flex items-center justify-center shadow-lg ">
                  <FaLightbulb className="text-white text-2xl" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-500/80 rounded-full flex items-center justify-center shadow-lg ">
                  <FaBook className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1A1F2C] to-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join brAIn buddy today and start getting instant answers from your
            study materials.
          </p>
          <Button
            className="bg-orange-500 m-auto hover:bg-orange-600 text-white cursor-pointer p-6 text-lg rounded-xl flex items-center shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all "
            onClick={() => {
              handleGoogleLogin();
            }}
          >
            <FaGoogle />
            Sign in with Google
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
