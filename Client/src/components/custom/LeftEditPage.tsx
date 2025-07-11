import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/card";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eraser,
} from "lucide-react";
import { toast } from "react-toastify";
import { RiGeminiLine } from "react-icons/ri";
import GeminiQuestion from "../../gemini/QuestionPrompt";
import { AIchatSession } from "../../gemini/AiModel";
import { FaDownload, FaMicrophone, FaPause } from "react-icons/fa";
import { Document, Paragraph, TextRun, Packer } from "docx";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface LeftEditPageProps {
  txtURL: string;
  title: string;
}

const LeftEditPage: React.FC<LeftEditPageProps> = ({ txtURL, title }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [accept, setAccept] = useState(false);
  const [editorContent, setEditorContent] = useState<string>("");
  const lastHtml = useRef("");
  const { transcript, listening } = useSpeechRecognition();

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const [geminiAnswer, setGeminiAnswer] = useState<string>("");

  const clearFormatting = () => {
    setEditorContent("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  useEffect(() => {
    const preventRefresh = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", preventRefresh);

    return () => {
      window.removeEventListener("beforeunload", preventRefresh);
    };
  }, []);

  const handleAdd = () => {
    const newText = `<br/> <b>${
      question.charAt(0).toUpperCase() + question.slice(1)
    }</b> <br/><b>Answer:</b> ${geminiAnswer}<br/>`;

    if (editorRef.current) {
      const existingContent = editorRef.current.innerHTML;
      setEditorContent(existingContent + newText);
    } else {
      setEditorContent((prev) => prev + newText);
    }

    setQuestion("");
    setGeminiAnswer("");
    setAccept(false);
    setOpen(false);
  };

  useEffect(() => {
    setQuestion(transcript);
  }, [transcript]);

  const handleSubmit = async () => {
    setLoading(true);
    setOpen(false);
    try {
      const res = await fetch(txtURL);
      const text = await res.text();

      const newPrompt = GeminiQuestion.replace("$$$", question).replace(
        "###",
        text
      );
      const result = await AIchatSession.sendMessage(newPrompt);
      setGeminiAnswer(
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text || ""
      );
    } catch (error) {
      console.error(error);
    } finally {
      setAccept(true);
      setLoading(false);
      setOpen(true);
    }
  };

  const downloadDocx = () => {
    if (!editorRef.current) return;

    const html = editorRef.current.innerHTML;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const docChildren: Paragraph[] = [];

    const processNodes = (nodes: NodeListOf<ChildNode>) => {
      nodes.forEach((node) => {
        if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent &&
          node.textContent.trim() !== ""
        ) {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.textContent.replace(/&nbsp;/g, " ").trim(),
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            })
          );
        } else if (node.nodeName === "BR") {
          docChildren.push(
            new Paragraph({
              spacing: { after: 200 },
            })
          );
        } else if (node.nodeName === "B" || node.nodeName === "STRONG") {
          const text = node.textContent
            ? node.textContent.replace(/&nbsp;/g, " ").trim()
            : "";
          if (text) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: text,
                    bold: true,
                    size: 28,
                    color: "000000",
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          }
        } else if (node.nodeName === "DIV" && node.childNodes.length > 0) {
          processNodes(node.childNodes);
        } else if (node.childNodes && node.childNodes.length > 0) {
          processNodes(node.childNodes);
        }
      });
    };

    processNodes(tempDiv.childNodes);

    if (docChildren.length === 0) {
      toast.error("No content to download");
      return;
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docChildren,
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    toast.success("Downloaded successfully!");
  };

  const handleInput = () => {
    if (editorRef.current && editorRef.current.innerHTML !== lastHtml.current) {
      lastHtml.current = editorRef.current.innerHTML;
      setEditorContent(lastHtml.current);
    }
  };

  useEffect(() => {
    if (editorRef.current && editorContent !== lastHtml.current) {
      editorRef.current.innerHTML = editorContent;
      lastHtml.current = editorContent;
    }
  }, [editorContent]);

  const showConfirmToast = () => {
    toast(
      ({ closeToast }) => (
        <div className="text-white flex flex-col items-center justify-center p-4">
          <p>Are you sure you want to clear all the text?</p>
          <div className="flex gap-4 mt-2">
            <button
              className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 cursor-pointer"
              onClick={closeToast}
            >
              No
            </button>
            <button
              className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer"
              onClick={() => {
                clearFormatting();
                closeToast();
              }}
            >
              Yes
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        style: { background: "black" },
      }
    );
  };
  return (
    <Card className="flex flex-col items-center rounded-2xl overflow-y-auto  h-screen max-[850px]:w-full p-4 gap-4 bg-[#1A1F2C] border border-white/30">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 w-full bg-black/20 p-3 rounded-xl backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => execCommand("bold")}
          className="hover:bg-orange-500/20 hover:text-orange-500 cursor-pointer"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => execCommand("italic")}
          className="hover:bg-orange-500/20 hover:text-orange-500 cursor-pointer"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => execCommand("underline")}
          className="hover:bg-orange-500/20 hover:text-orange-500 cursor-pointer"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => execCommand("justifyLeft")}
          className="hover:bg-orange-500/20 hover:text-orange-500 cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => execCommand("justifyCenter")}
          className="hover:bg-orange-500/20 hover:text-orange-500 cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => execCommand("justifyRight")}
          className="hover:bg-orange-500/20 hover:text-orange-500 cursor-pointer"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={downloadDocx}
          className="hover:bg-orange-500/20 hover:text-orange-500 cursor-pointer"
          title="Download"
        >
          <FaDownload />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="hover:bg-orange-500/20 hover:text-orange-500 cursor-pointer"
          title="Ask Question"
        >
          <RiGeminiLine className="bg-gradient-to-b  text-red-400" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={showConfirmToast}
          className="hover:bg-red-500/20 hover:text-red-500 ml-auto cursor-pointer"
          title="Clear text"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      {loading && (
        <div className="bg-black rounded-xl py-6 px-8 w-full min-w-[90%] flex flex-col gap-4">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 border-4 border-transparent border-t-orange-500 border-b-orange-500 rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-semibold">
              Working on your answer...
            </p>
          </div>
        </div>
      )}
      {open && (
        <div className="bg-black rounded-xl w-full py-6 px-8 min-w-[90%] flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-center">
            Ask Your Question
          </h2>
          <input
            type="text"
            placeholder="Type your question..."
            className="border p-2 rounded-md focus:outline-orange-500"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <p>{geminiAnswer ? <strong>Answer: {geminiAnswer} </strong> : ""}</p>

          <div className="flex justify-between gap-4 items-center">
            {accept ? (
              <div className="flex justify-end w-full">
                <Button
                  onClick={handleAdd}
                  className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                >
                  Add
                </Button>
              </div>
            ) : (
              <>
                <div
                  className="bg-orange-500/30 rounded-full p-3 cursor-pointer  transition-all duration-200 hover:bg-orange-500 flex justify-center items-center gap-1 text-sm"
                  onClick={() => SpeechRecognition.startListening()}
                >
                  {listening ? (
                    <div
                      className="flex justify-center items-center gap-1"
                      onClick={() => {
                        SpeechRecognition.stopListening();
                      }}
                    >
                      <FaPause /> Listening...
                    </div>
                  ) : (
                    <FaMicrophone />
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setQuestion("");
                      setOpen(false);
                    }}
                    className=" cursor-pointer hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => {
                      handleSubmit();
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        spellCheck={false}
        suppressContentEditableWarning
        data-placeholder="Type your notes here..."
        onInput={handleInput}
        onBlur={handleInput}
        className="
    w-full h-full p-4 rounded-xl border border-white/20 
    bg-black/20 backdrop-blur-sm overflow-y-auto outline-none text-md 
    focus:ring-2 focus:ring-orange-500/50 transition-all 
    empty:before:content-[attr(data-placeholder)] 
    empty:before:text-gray-500 empty:before:pointer-events-none
  "
      />
    </Card>
  );
};

export default LeftEditPage;
