
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useOutletContext } from "react-router";
import { Camera, X } from "lucide-react";

import CustomInput from "./CustomTextInputBox";

interface AddImageHgContext {
  text: string;
  setText: (text: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const AddImageHg = () => {
  const { text, setText, imageFile, setImageFile } =
    useOutletContext<AddImageHgContext>();

  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create and clean up the local image preview URL.
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  // Open the file picker.
  const handleClick = () => {
    inputRef.current?.click();
  };

  // Validate and select the image.
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Allow selecting the same file again.
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    setImageFile(file);
    setError(null);
  };

  // Remove the selected image.
  const handleRemove = () => {
    setImageFile(null);
    setError(null);
  };

  return (
    <div className="flex w-full flex-col items-center px-5 py-5 text-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {previewUrl ? (
        <div className="relative h-64 w-full overflow-hidden rounded-xl border border-gray-300">
          <img
            src={previewUrl}
            alt="Selected Highlight preview"
            className="h-full w-full object-contain"
          />

          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove selected image"
            className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-red-600"
          >
            <X size={18} />
          </button>

          <button
            type="button"
            onClick={handleClick}
            className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-3 py-2 text-sm text-white transition-colors hover:bg-black/80"
          >
            Change image
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-400 transition-colors hover:border-purple-500"
        >
          <span className="rounded-full bg-[#F3E8FF] px-4 py-4">
            <Camera stroke="#9810FA" size={30} />
          </span>

          <h3 className="pt-1 font-semibold text-gray-600">
            Upload Image
          </h3>

          <p className="text-gray-400">
            Click to choose an image
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Maximum file size: 5 MB
          </p>
        </button>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}

      <CustomInput
        value={text}
        onChange={setText}
        placeholder="Add a caption (optional)"
        maxLength={220}
        className="relative mt-4 min-h-16 w-full whitespace-pre-wrap wrap-break-words rounded-xl border border-gray-400 px-3 py-2 text-left text-sm text-black outline-none"
      />
    </div>
  );
};

export default AddImageHg;
