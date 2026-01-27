import { useOutletContext } from "react-router";
import EditableText from "./CustomTextInputBox";

interface AddTextHgContext {
  text: string;
  backgroundPresets: string[];
  bgColor: string;
  setBgColor: (color: string) => void;
  setText: (text: string) => void;
}

const AddTextHg = () => {
  const { text, backgroundPresets, bgColor, setBgColor, setText } =
    useOutletContext<AddTextHgContext>();

  return (
    <div className="max-h-full w-full flex flex-col items-center py-5">
      {/* Highlight preview */}
      <div
        className="preview relative flex justify-center items-center w-[90%] h-60 rounded-2xl shadow-md"
        style={{ background: bgColor }}
      >
        <EditableText value={text} onChange={setText} className="relative text-center px-3 outline-none wrap-break-words whitespace-pre-wrap min- text-xl empty:before:content-[attr(data-placeholder)] min-w-40 empty:before:min-w-40 empty:before:absolute empty:before:left-1/2 empty:before:top-1/2 empty:before:-translate-x-1/2 empty:before:-translate-y-1/2
      empty:before:text-gray-500 empty:before:pointer-events-none"  />
      </div>

      {/* Character counter */}
      <p className="w-full text-right px-8 mt-2 text-gray-500/90 font-semibold">
        {text.length}/220
      </p>

      {/* Background selector */}
      <div className="mt-4 w-full flex flex-col items-center">
        <p className="w-full ml-8 text-gray-500 font-semibold text-sm">Backgrounds</p>
        <div className="grid grid-cols-6 gap-2 mt-2">
          {backgroundPresets.map((color, index) => (
            <div
              key={index}
              onClick={() => setBgColor(color)}
              className="w-10 h-10 rounded-lg shadow-md cursor-pointer"
              style={{ background: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddTextHg;


