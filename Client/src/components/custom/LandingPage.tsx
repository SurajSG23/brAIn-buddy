import { Button } from "../ui/Button";
import {
  FaGoogle,
  FaRobot,
  FaBook,
  FaComments,
  FaQuestionCircle,
  FaArrowRight,
  FaLightbulb,
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="bg-[#1A1F2C] min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-40 overflow-hidden">
        {/* Background Elements */}
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
          {/* Header/Nav */}
          <header className="flex justify-between items-center mb-20">
            <div className="flex items-center">
              <FaRobot className="text-orange-500 text-2xl mr-2" />
              <h1 className="text-xl font-bold text-white">
                br<span className="text-orange-500">AI</span>n buddy
              </h1>
            </div>
          </header>

          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-white">Welcome to </span>
                <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                  brAIn buddy
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Upload your study materials and get instant AI-powered answers
                to all your questions.
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-xl flex items-center shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all">
                <FaGoogle className="mr-2" />
                Sign in with Google
              </Button>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 md:w-96 md:h-96 bg-gray-800 rounded-2xl shadow-xl overflow-hidden bg-opacity-60 backdrop-blur-md border border-white/20 animate-float">
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

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How <span className="text-orange-500">brAIn buddy</span> Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your intelligent study companion that makes learning efficient and
              effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature Cards with Tailwind colors */}
            <div className="bg-black/60 rounded-xl p-8 shadow-lg border border-gray-700/20 hover:border-orange-500/30 transition-all">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                <FaBook className="text-orange-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Upload Study Material
              </h3>
              <p className="text-gray-300">
                Simply upload your study materials, lecture notes, or textbooks
                in PDF format.
              </p>
            </div>

            {/* Similar modifications for other feature cards */}
            <div className="bg-black/60 rounded-xl p-8 shadow-lg border border-gray-700/20 hover:border-orange-500/30 transition-all">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                <FaRobot className="text-orange-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Analysis</h3>
              <p className="text-gray-300">
                Our AI scans and comprehends your materials, creating a
                knowledge base specific to your content.
              </p>
            </div>

            <div className="bg-black/60 rounded-xl p-8 shadow-lg border border-gray-700/20 hover:border-orange-500/30 transition-all">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                <FaComments className="text-orange-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Get Instant Answers
              </h3>
              <p className="text-gray-300">
                Ask questions about your material and receive accurate,
                contextual answers instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Remaining sections continue with similar color replacements */}
      {/* About Section */}
      <section className="py-20 bg-[#1A1F2C]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h2 className="text-4xl font-bold text-white mb-6">
                About <span className="text-orange-500">brAIn buddy</span>
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
              {/* Further sections remain similar, just with Tailwind color classes */}
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
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-xl flex items-center mx-auto shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all">
            <FaGoogle className="mr-2" />
            Get Started with Google
            <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#1A1F2C] border-t border-gray-700/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FaRobot className="text-orange-500 text-xl mr-2" />
              <span className="text-white font-bold">
                br<span className="text-orange-500">AI</span>n buddy
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} brAIn buddy. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
