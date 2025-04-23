import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Button } from "../ui/Button";

const Footer = () => {
  return (
    <footer className="p-5 bg-[#000000] border-t border-gray-700/20 w-full ">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col  mb-4 md:mb-0 text-gray-400">
            <div className="flex items-center  ">
              <img src="favicon.png" alt="" width={35} />
              <img src="logo.png" alt="" width={200} />
            </div>
            <div>
              © {new Date().getFullYear()} brAIn buddy. All rights reserved.
            </div>
          </div>
          <div className="text-gray-400 text-sm flex flex-col items-center justify-center gap-3 md:items-start ">
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-white mb-2 mx-auto">Connect with me</h3>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-800 hover:text-orange-500"
                  asChild
                >
                  <a
                    href="https://www.instagram.com/suraj_sg23/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={20} />
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-800 hover:text-orange-500"
                  asChild
                >
                  <a
                    href="https://www.linkedin.com/in/suraj-s-g-dhanva-995a23298/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={20} />
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-800 hover:text-orange-500"
                  asChild
                >
                  <a
                    href="https://github.com/SurajSG23"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <FaGithub size={20} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
