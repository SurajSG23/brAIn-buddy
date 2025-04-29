import { useState, useEffect } from "react";
import { Mic, Play } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/card";
import { toast } from "sonner";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PodcastPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationArray, setConversationArray] = useState<
    { text: string; speaker: string }[]
  >([]);
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    setLoadingPage(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          const userFound = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/register/getuser/${
              user.email
            }`,
            { withCredentials: true }
          );
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/project/openedProject/${
              userFound.data._id
            }`,
            { withCredentials: true }
          );
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/project/closeproject/${
              userFound.data._id
            }`,
            { withCredentials: true }
          );
          const extractedText = await fetch(res.data[0].podcastURL);
          const text = await extractedText.text();
          setConversationArray(
            JSON.parse(text.replace("```json", "").replace("```", ""))
          );
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoadingPage(false);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
