import { useOutletContext } from "react-router";
import { useRef } from "react";

const MAX_CHAR_LIMIT = 220;

//interface for outlet context
interface AddTextHgContext {
  text: string;
  backgroundPresets: string[];
  bgColor: string;
  setBgColor: (color: string) => void;
  setText: (text: string) => void;
}

const AddTextHg = () => {
  const { text, backgroundPresets, bgColor, setBgColor, setText } = useOutletContext<AddTextHgContext>();
  const editableRef = useRef<HTMLDivElement>(null);

  // Handle typing with character limit and caret fix
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    let text = el.textContent || "";

    if (text.length > MAX_CHAR_LIMIT) {
      text = text.slice(0, MAX_CHAR_LIMIT);
      el.textContent = text;

      // Keep caret at end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }

    setText(text);
  };

  return (
    <div className="h-full w-full flex flex-col items-center py-7">
      {/* Highlight preview */}
      <div
        className="preview relative flex justify-center items-center w-[90%] h-60 rounded-2xl shadow-md"
        style={{ background: bgColor }} // default
      >
        <div
          ref={editableRef}
          contentEditable
          data-placeholder="Type here..."
          onInput={handleInput}
          className={`  min-w-40
             relative max-w-[90%] text-center outline-none
            wrap-break-words whitespace-pre-wrap min-h-16 text-xl text-white
            empty:before:content-[attr(data-placeholder)]
            empty:before:absolute empty:before:left-1/2 empty:before:top-1/2
            empty:before:-translate-x-1/2 empty:before:-translate-y-1/2 empty:before:min-w-20
            empty:before:text-gray-500 empty:before:pointer-events-none
              empty:before:min-h-16 empty:before:w-40
             border
             
          `}
        />
      </div>

      {/* Character counter */}
      <p className="w-full text-right px-8 mt-2 text-gray-500/90 font-semibold">
        {text.length}/{MAX_CHAR_LIMIT}
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
