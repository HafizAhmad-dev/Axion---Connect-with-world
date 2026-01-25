import type { LucideIcon } from 'lucide-react';
import { Type, Image, Video } from 'lucide-react';
import { useState } from 'react';
import AddTextHg from '../Components/AddTextHg';
import AddImageHg from '../Components/AddImageHg';
import AddVideoHg from '../Components/AddVideoHg';

type BtnTitles = 'text' | 'image' | 'video';
interface NavBtnsType {
  title: BtnTitles;
  Icon: LucideIcon;
  bname: string
};

const navBtns: NavBtnsType[] = [
  {
    title: 'text',
    Icon: Type,
    bname: 'Text'
  },
  {
    title: 'image',
    Icon: Image,
    bname: 'Image'
  },
  {
    title: 'video',
    Icon: Video,
    bname: 'Video'
  }
];
const highlightMap: Record<BtnTitles, React.ReactNode> = {
  text: <AddTextHg />,
  image: <AddImageHg />,
  video: <AddVideoHg />
};

const AddHighlightSection = () => {
  const [highlightType, setHighlightType] = useState<BtnTitles>('image');

  return (
    <section className='flex flex-col h-full'>
      {/* //navbar */}
      <nav className='flex border-b border-gray-300'>
        {navBtns.map((btn) => (
          <Button key={btn.title} title={btn.title} Icon={btn.Icon} bname={btn.bname} highlightType={highlightType} setType={setHighlightType} />
        ))}
      </nav>

      {/* //main content */}
      <main className='flex-1'>
        {highlightMap[highlightType]}
      </main>
    </section>
  )
}

export default AddHighlightSection


// Button Component for NavBtns
const Button = (
  { title, Icon, bname, highlightType, setType }: { title: BtnTitles; Icon: LucideIcon; bname: string; highlightType: BtnTitles; setType: React.Dispatch<React.SetStateAction<BtnTitles>> }
) => {
  return (
    <button
      key={title}
      className={`  py-3 w-full flex justify-center items-center gap-2 font-semibold ${highlightType === title ? 'border-b border-[#A023FA] text-[#A023FA] bg-[#FAF5FF]' : ' text-gray-500'} transition-colors `}
      onClick={() => setType(title)}
    >
      <Icon />
      {bname}
    </button>
  )
}
