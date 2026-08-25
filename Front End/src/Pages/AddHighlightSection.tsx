import type { LucideIcon } from "lucide-react";
import { Type, Image, Video } from "lucide-react";
import { useOutletContext } from "react-router";

import AddTextHg from "../Components/AddTextHg";
import AddImageHg from "../Components/AddImageHg";
import AddVideoHg from "../Components/AddVideoHg";

import type { HighlightType } from "../Types/Highlights.types";

interface AddHighlightContext {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;

  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;

  bgColor: string;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;

  backgroundPresets: string[];

  highlightType: HighlightType;
  setHighlightType: React.Dispatch<React.SetStateAction<HighlightType>>;
}

type NavButton = {
  title: HighlightType;
  Icon: LucideIcon;
  bname: string;
};

const navBtns: NavButton[] = [
  {
    title: "text",
    Icon: Type,
    bname: "Text",
  },
  {
    title: "image",
    Icon: Image,
    bname: "Image",
  },
  {
    title: "video",
    Icon: Video,
    bname: "Video",
  },
];

const AddHighlightSection = () => {
  const { highlightType, setHighlightType } =
    useOutletContext<AddHighlightContext>();

  const highlightMap: Record<HighlightType, React.ReactNode> = {
    text: <AddTextHg />,
    image: <AddImageHg />,
    video: <AddVideoHg />,
  };

  return (
    <section className="flex flex-col h-full">
      {/* Navigation */}
      <nav className="flex">
        {navBtns.map((btn) => (
          <Button
            key={btn.title}
            title={btn.title}
            Icon={btn.Icon}
            bname={btn.bname}
            highlightType={highlightType}
            setType={setHighlightType}
          />
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 relative">{highlightMap[highlightType]}</main>
    </section>
  );
};

export default AddHighlightSection;

// Button Component for NavBtns
const Button = ({
  title,
  Icon,
  bname,
  highlightType,
  setType,
}: {
  title: HighlightType;
  Icon: LucideIcon;
  bname: string;
  highlightType: HighlightType;
  setType: React.Dispatch<React.SetStateAction<HighlightType>>;
}) => {
  return (
    <button
      className={`
        py-3
        w-full
        flex
        justify-center
        items-center
        gap-2
        font-semibold
        ${
          highlightType === title
            ? "border-b border-[#A023FA] text-[#A023FA] bg-[#FAF5FF]"
            : "text-gray-500 border-b border-gray-300"
        }
        transition-colors
      `}
      onClick={() => setType(title)}
    >
      <Icon />
      {bname}
    </button>
  );
};
