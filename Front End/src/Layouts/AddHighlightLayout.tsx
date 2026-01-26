import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router";
import { addHighlight } from "../Store/Slices/UserSlice";
import type { Highlight } from "../Components/MockHiglights";
import { useState } from "react";

export const backgroundPresets = [
  // Soft plain colors
  '#FFE4E1', '#FFF0E5', '#FFF5D9', '#E0F7FA', '#D9F0FF', '#FCE4FF', '#EDE7FF', '#E0FFE0', '#FFF3F0', '#FDF6E3',
  // Gradients
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
  'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
];

const AddHighlightLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State lifted to layout
  const [text, setText] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bgColor, setBgColor] = useState<string>(backgroundPresets[0]);

  const handleClose = () => navigate(-1);

  const handleShare = () => {
    if (!text.trim() && !imageFile) return; // prevent empty highlight

    const newHighlight: Highlight = {
      id: Date.now().toString(),
      type: imageFile ? "image" : "text",
      content: text || undefined,
      imageFile: imageFile || undefined,
      backgroundColor: bgColor,
      timestamp: new Date().toISOString(),
    };

    dispatch(addHighlight(newHighlight));
    navigate(-1);
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      {/* Header */}
      <header className="flex justify-between px-5 py-5 bg-linear-to-r from-purple-500 to-pink-600">
        <h2 className="text-lg font-bold text-white">Add Highlight</h2>

        <button
          className="hover:bg-white/20 rounded-full w-7 h-7 flex justify-center items-center"
          onClick={handleClose}
        >
          <X size={15} stroke="white" />
        </button>
      </header>

      {/* Outlet - pass state via context */}
      <main className="flex-1">
        <Outlet context={{ text, setText, imageFile, setImageFile, bgColor, setBgColor, backgroundPresets }} />
      </main>

      {/* Footer buttons */}
      <div className="flex justify-around items-center px-4 py-4 bg-[#F8FAFC] border-t border-gray-300">
        <button
          onClick={handleClose}
          className="px-10 py-2 border border-gray-400 rounded-xl font-semibold text-gray-600 hover:bg-black/5"
        >
          Cancel
        </button>
        <button
          onClick={handleShare}
          className="px-10 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-purple-500 to-pink-600"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default AddHighlightLayout;
