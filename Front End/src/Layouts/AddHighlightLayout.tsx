import { useState } from "react";
import { X } from "lucide-react";
import { Outlet, useNavigate } from "react-router";

import type {
  HighlightTextPostData,
  HighlightType,
} from "../Types/Highlights.types";

import { apiFetch } from "../utils/api";
import { uploadImage } from "../services/imagekit.service"; // Adjust to your actual service path.

const apiUrl = import.meta.env.VITE_API_URL;

export const backgroundPresets = [
  // Soft plain colors
  "#FFE4E1",
  "#FFF0E5",
  "#FFF5D9",
  "#E0F7FA",
  "#D9F0FF",
  "#FCE4FF",
  "#EDE7FF",
  "#E0FFE0",
  "#FFF3F0",
  "#FDF6E3",

  // Gradients
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #13547a 0%, #80d0c7 100%)",
  "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)",
  "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
  "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
];

const AddHighlightLayout = () => {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bgColor, setBgColor] = useState(backgroundPresets[0]);

  const [highlightType, setHighlightType] =
    useState<HighlightType>("text");

  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    navigate(-1);
  };

  const canShare =
    highlightType === "text"
      ? text.trim().length > 0
      : imageFile !== null;

  const handleShare = async () => {
    if (!canShare || isSharing) return;

    setIsSharing(true);
    setError(null);

    try {
      if (highlightType === "text") {
        const reqData: HighlightTextPostData = {
          type: "text",
          caption: text.trim(),
          background: bgColor,
        };

        await apiFetch(`${apiUrl}/highlights/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqData),
        });
      } else if (highlightType === "image" && imageFile) {
        
        // Upload the image directly to ImageKit.
        const uploadedImage = await uploadImage(imageFile,'highlights');
        
        console.log("Uploaded image:", uploadedImage);
        if (!uploadedImage.url) {
          throw new Error("Image upload did not return a URL.");
        }

        // Save the returned URL in your backend.
        const reqData = {
          type: "image" as const,
          mediaUrl: uploadedImage.url,
          caption: text.trim() || null,
        };

        await apiFetch(`${apiUrl}/highlights/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqData),
        });
      } else {
        return;
      }
    
      navigate("/user/highlights");
    } catch (error) {
      console.error("Failed to create Highlight:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create Highlight. Please try again."
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      {/* Header */}
      <header className="flex justify-between bg-linear-to-r from-purple-500 to-pink-600 px-5 py-5">
        <h2 className="font-hfont text-lg font-bold text-white">
          Add Highlight
        </h2>

        <button
          type="button"
          onClick={handleClose}
          disabled={isSharing}
          aria-label="Close"
          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20 disabled:opacity-50"
        >
          <X size={15} stroke="white" />
        </button>
      </header>

      {/* Child route */}
      <main className="flex-1">
        <Outlet
          context={{
            text,
            setText,

            imageFile,
            setImageFile,

            bgColor,
            setBgColor,

            backgroundPresets,

            highlightType,
            setHighlightType,
          }}
        />
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-around border-t border-gray-300 bg-[#F8FAFC] px-4 py-4 font-hfont tracking-wider">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSharing}
          className="rounded-xl border border-gray-400 px-10 py-2 font-semibold text-gray-600 hover:bg-black/5 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleShare}
          disabled={!canShare || isSharing}
          className={`rounded-xl bg-linear-to-r from-purple-500 to-pink-600 px-10 py-2 font-semibold text-white ${
            !canShare || isSharing
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
        >
          {isSharing ? "Sharing..." : "Share"}
        </button>
      </footer>

      {error && (
        <p role="alert" className="px-4 py-2 text-center text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default AddHighlightLayout;