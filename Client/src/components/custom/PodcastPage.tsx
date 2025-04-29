import { useState, useEffect } from "react";
import { Mic, Play } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/card";
import { toast } from "sonner";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";

const conversationArray = [
  {
    speaker: "male",
    text: "So, this project, 'Shopy Zone', is an e-commerce product listing website, right?",
  },
  {
    speaker: "female",
    text: "Exactly! It's Suraj's first project for IntrnForte's Full Stack Web Development course.",
  },
  {
    speaker: "male",
    text: "And it focuses on three main categories: Electronics, Clothing, and Accessories.",
  },
  {
    speaker: "female",
    text: "Yes, letting users browse products within their chosen category.",
  },
  {
    speaker: "male",
    text: "The tech stack is interesting. ReactJS with Vite, Bootstrap for styling, and Vercel/GitHub for deployment.",
  },
  {
    speaker: "female",
    text: "He used Styled Components for styling, avoiding extra folders. Pretty efficient!",
  },
  {
    speaker: "male",
    text: "The functionality includes a search bar and product filtering options for a better user experience.",
  },
  {
    speaker: "female",
    text: "And the UI is enhanced with React Icons, adding visual appeal.",
  },
  {
    speaker: "male",
    text: "The screenshots show a clear header, body, and footer structure—a well-organized homepage.",
  },
  {
    speaker: "female",
    text: "The footer even includes social media links for easy contact with the developer.",
  },
  {
    speaker: "male",
    text: "One challenge he mentioned was making the site responsive across different devices.",
  },
  {
    speaker: "female",
    text: "That's a common hurdle. Responsive design often takes a lot more time.",
  },
  {
    speaker: "male",
    text: "Deployment was another challenge, but he successfully hosted it on Vercel.",
  },
  {
    speaker: "female",
    text: "Overall, it sounds like a successful first project, focusing on user-friendliness and efficient navigation.",
  },
];

const PodcastPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const synth = window.speechSynthesis;
      setSynth(synth);

      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        setMaleVoice(availableVoices[3]);
        setFemaleVoice(availableVoices[2]);
      };

      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
      }

      loadVoices();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string, speaker: string) => {
    if (!synth) return;

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.volume = 1;
    newUtterance.pitch = 1.1;
    newUtterance.rate = 1.0;

    if (speaker === "male" && maleVoice) {
      newUtterance.voice = maleVoice;
    } else if (speaker === "female" && femaleVoice) {
      newUtterance.voice = femaleVoice;
    }

    setActiveSpeaker(speaker);

    newUtterance.onend = () => {
      setActiveSpeaker(null);

      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex < conversationArray.length) {
          const current = conversationArray[nextIndex];
          speakText(current.text, current.speaker);
        } else {
          toast.info("Conversation finished");
        }

        return nextIndex;
      });
    };

    synth.speak(newUtterance);
  };

  const callSpeak = () => {
    if (currentIndex < conversationArray.length) {
      const current = conversationArray[currentIndex];
      speakText(current.text, current.speaker);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-brain-black text-white">
      <h1 className="text-3xl font-bold mb-6 mt-6 text-gradient">
        Project Discussion
      </h1>

      <div className="w-full max-w-4xl mb-8 space-y-6">
        {conversationArray.map((item, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ${
              index <= currentIndex ? "block" : "hidden"
            }`}
          >
            <Card
              className={`bg-gradient-to-b from-brain-darkgray/70 to-brain-black/90 border border-white/10 shadow-xl ${
                item.speaker === "male" ? "bg-blue-900/20" : "bg-pink-900/20"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 overflow-hidden ${
                      item.speaker === "male" ? "bg-blue-500" : "bg-pink-500"
                    }`}
                  >
                    <img
                      src={
                        item.speaker === "male" ? "/male.png" : "/female.png"
                      }
                      alt={item.speaker}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      {item.speaker === "male" ? "Alex" : "Emma"}
                    </h3>

                    {index === currentIndex && activeSpeaker && (
                      <div className="flex items-center">
                        <Mic size={16} className="mr-1 text-brain-orange" />
                        <span className="text-sm text-white/70">
                          Speaking now
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-white/90 text-lg">{item.text}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Controls */}
      <Card className="w-full max-w-md bg-brain-darkgray/70 border border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-4">
            {isPlaying ? (
              <Link
                to="/homepage"
                className="flex gap-1 duration-200 bg-gray-600 hover:bg-gray-700 p-2 rounded-md cursor-pointer"
              >
                <MdLogout size={24} />
                Back
              </Link>
            ) : (
              <Button
                onClick={() => {
                  callSpeak();
                  setIsPlaying(true);
                }}
                className="flex gap-1 duration-200 bg-gray-600 hover:bg-gray-700 p-2 rounded-md cursor-pointer"
              >
                <Play size={24} />
                Play
              </Button>
            )}
          </div>
          <div className="text-center text-sm text-white/60">
            {currentIndex + 1} of {conversationArray.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PodcastPage;
