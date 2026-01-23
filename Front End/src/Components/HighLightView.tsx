import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../Store/store";
import { markAsSeen } from "../Store/Slices/HighlightsSlice";

interface HighLightViewProps {
  highlightsId: string;
  owner: "self" | "other";
  onComplete: () => void;
}

const HighLightView = ({ highlightsId, onComplete, owner }: HighLightViewProps) => {
  const dispatch = useDispatch();

  // Select highlights from Redux store
  const selfHighlights = useSelector((state: RootState) => state.user.highlights);
  const otherHighlights = useSelector((state: RootState) =>
    state.highlights.highlights.find(hg => hg.id === highlightsId)
  );

  // Memoize the final object to prevent new references each render
  const userHighlights = useMemo(() => {
    if (owner === "self") {
      return {
        id: 'self',
        user: "You",
        highlight: selfHighlights
      };
    }
    return otherHighlights ?? null;
  }, [owner, selfHighlights, otherHighlights]);

  // Extract highlights array safely
  const highlights = userHighlights?.highlight || [];

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const totalTime = 5000;
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  // Animate progress
  useEffect(() => {
    if (!highlights.length) return;

    const animate = (time: number) => {
      if (!paused) {
        if (pauseTimeRef.current) {
          startTimeRef.current += time - pauseTimeRef.current;
          pauseTimeRef.current = 0;
        }

        const elapsed = time - startTimeRef.current;
        const p = Math.min((elapsed / totalTime) * 100, 100);
        setProgress(p);

        if (p >= 100) {
          nextHighlight();
          return;
        }
      } else {
        pauseTimeRef.current = time;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    startTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [paused, index, highlights]);

  const nextHighlight = () => {
    if (index === highlights.length - 1) {
      setTimeout(() => {
        dispatch(markAsSeen(userHighlights?.id || highlightsId));
        onComplete();
      }, 0);

      setProgress(100);
      return;
    }

    setIndex(prev => prev + 1);
    setProgress(0);
  };

  const prevHighlight = () => {
    setIndex(prev => (prev === 0 ? highlights.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 3) prevHighlight();
    else if (x > (2 * rect.width) / 3) nextHighlight();
    else setProgress(0);
  };

  if (!userHighlights) return null; // nothing to show

  useEffect(() => {
    console.log(userHighlights)
  }, [userHighlights]);

  return (
    <div
      className={`fixed inset-0 z-99 flex flex-col justify-center items-center ${highlights[index]?.backgroundColor ?? ''} bg-cover bg-center`}
      style={{ background: highlights[index].backgroundColor }}
      onClick={handleClick}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* Top segmented progress bars */}
      <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
        {highlights.map((_, i) => {
          const width = i < index ? 100 : i === index ? progress : 0;
          return (
            <div key={i} className="flex-1 h-2 bg-white/30 rounded overflow-hidden">
              <div className="h-full bg-white rounded" style={{ width: `${width}%` }} />
            </div>
          );
        })}
      </div>

      {/* Highlight content */}
      <p className="text-white text-center text-3xl font-semibold drop-shadow-lg px-4 max-w-[90%] wrap-break-word">
        {highlights[index]?.content}
      </p>

      {/* Username at bottom */}
      <p className="absolute bottom-8 text-white text-lg font-medium drop-shadow-md">
        {userHighlights.user}
      </p>
    </div>
  );
};

export default HighLightView;
