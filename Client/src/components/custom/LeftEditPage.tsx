import React, { useRef } from "react";
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

const LeftEditPage = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const clearFormatting = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };
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
    <Card className="flex flex-col items-center rounded-2xl w-[50%] h-screen max-[850px]:w-full p-4 gap-4 bg-[#1A1F2C] border border-white/20">
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
          onClick={showConfirmToast}
          className="hover:bg-red-500/20 hover:text-red-500 ml-auto cursor-pointer"
          title="Clear text"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="w-full h-full p-4 rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm overflow-y-auto outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
        style={{ minHeight: "400px" }}
        suppressContentEditableWarning
      />
    </Card>
  );
};

export default LeftEditPage;
