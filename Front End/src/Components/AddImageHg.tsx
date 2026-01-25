import { Camera } from "lucide-react";
import { useRef, useState, type ChangeEvent, type ReactHTMLElement } from "react"


const AddImageHg = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  // hangle fileINput change
  function handlechange(e: ChangeEvent<HTMLInputElement>) {
    const selectedImage = e.target.files![0];
    setFile(selectedImage);
    e.target.files = null;
  }

  // programmitically triger the input element
  function handleClick() {
    inputRef.current?.click();
  }

  return (
    <div className="px-5 py-5 flex flex-col justify-center text-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp,image/heic,image/heif"
        className={`hidden`}
        onChange={handlechange}
      />
      <div
        className="preview w-full border border-black border-dashed rounded-xl hover:rounded h-65 flex flex-col items-center justify-center cursor-pointer hover:border hover:border-purple-500 transition-colors "
        onClick={handleClick}
      >
        <span className="px-4 py-4 rounded-full bg-[#F3E8FF]">
          <Camera stroke="#9810FA" size={30} />
        </span>

        {/* upload image text */}
        <span className=" pt-1"> <h3 className="font-semibold text-gray-600 animate-ImageHeading">Upload Images</h3></span>


        <p className=" text-gray-400  animate-ImageText ">Click to Choose Image</p>
      </div>
    </div>
  )
}

export default AddImageHg
