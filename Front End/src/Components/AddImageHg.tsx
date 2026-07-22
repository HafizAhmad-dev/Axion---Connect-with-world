import { useRef, useState, type ChangeEvent, useEffect } from "react";
import { useOutletContext } from "react-router";
import { Camera } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Thumbs } from "swiper/modules";
import 'swiper/css';


import CustomInput from "./CustomTextInputBox";
import DevBlock from "./UnderDev";

interface AddImageHgContext {
  text: string;
  setText: (text: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
}

const AddImageHg = () => {
  const { text, setText, setImageFile } =
    useOutletContext<AddImageHgContext>();

  const inputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Pick the first file for now
    setImageFile(selectedFiles[0]);

    // Generate preview
    const previews = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews(previews);

    setTimeout(() => {
      e.target.value = "";
    }, 0);
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className="px-5 py-5 flex flex-col items-center text-center w-full">
      <DevBlock />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        multiple
      />

      {imagePreviews.length > 0 ? (
        <>
          {/* Main Slider */}
          <Swiper
            modules={[Keyboard, Thumbs]}
            spaceBetween={10}
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper }}
            keyboard={{ enabled: true }}
            className="w-full h-64 rounded-xl overflow-hidden border border-gray-300"
          >
            {imagePreviews.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnail Slider */}
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Keyboard, Thumbs]}
            spaceBetween={5}
            slidesPerView={Math.min(imagePreviews.length, 5)}
            watchSlidesProgress
            className="w-full h-16 mt-2"
          >
            {imagePreviews.map((src, index) => (
              <SwiperSlide key={index} className="cursor-pointer flex justify-center">
                <img
                  src={src}
                  alt={`Thumb ${index + 1}`}
                  className="w-full  h-16 object-cover rounded-lg border border-gray-300"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : (
        <div
          className="w-full border border-dashed border-gray-400 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
          onClick={handleClick}
        >
          <span className="px-4 py-4 rounded-full bg-[#F3E8FF]">
            <Camera stroke="#9810FA" size={30} />
          </span>
          <h3 className="pt-1 font-semibold text-gray-600">Upload Image</h3>
          <p className="text-gray-400">Click to Choose Image</p>
        </div>
      )}

      <CustomInput
        value={text}
        onChange={setText}
        placeholder="Add a caption (optional)"
        maxLength={220}
        className="relative text-left px-3 py-2 outline-none wrap-break-words whitespace-pre-wrap min-h-16 text-sm w-full
        empty:before:content-[attr(data-placeholder)] empty:before:absolute empty:before:left-2 empty:before:top-2
        empty:before:text-gray-500 empty:before:pointer-events-none border border-gray-400 rounded-xl text-black"
      />
    </div>
  );
};

export default AddImageHg;
