import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../Store/store";
import { markAsSeen } from "../Store/Slices/HighlightsSlice";
import { apiFetch } from "../utils/api";

const apiUrl = import.meta.env.VITE_API_URL;

interface HighLightViewProps {
  ownerId: string;
  owner: "self" | "other";
  onComplete: () => void;
}

interface HighlightDetails {
  displayName:string,
  username:string,
  time: string,
}

const HighLightView = ({ ownerId, owner, onComplete }: HighLightViewProps) => {
  const dispatch = useDispatch();

  const user = useSelector((state:RootState) => state.user.user);
  // Friend data — only needed when viewing someone else's highlights
  const friend = useSelector((state: RootState) =>
    state.highlights.friendsHighlights.find((fh) => fh.userId === ownerId),
  );

  // My highlights — only needed when owner === "self"
  const myHighlights = useSelector(
    (state: RootState) => state.highlights.myHighlights,
  );

  // Decide which highlights this viewer should display
  const highlights =
    owner === "self" ? myHighlights : (friend?.highlights ?? []);

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const totalTime = 5000;

  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  async function markAsView(highlightId: string) {
    try {
      const response = await apiFetch(
        `${apiUrl}/highlights/${highlightId}/view`,
        { method: "POST" },
      );
      console.log("view response", response);
    } catch (error) {
      console.log(error);
    }
  }

  /*


   * Reset viewer when a different owner is opened.
   */
  useEffect(() => {
    setIndex(0);
    setProgress(0);
    setPaused(false);

    startTimeRef.current = 0;
    pauseTimeRef.current = 0;
  }, [ownerId]);

  /*
   * Animate current highlight.
   */
  useEffect(() => {
    if (highlights.length === 0) {
      return;
    }

    const animate = (time: number) => {
      if (!paused) {
        if (pauseTimeRef.current) {
          startTimeRef.current += time - pauseTimeRef.current;

          pauseTimeRef.current = 0;
        }

        const elapsed = time - startTimeRef.current;

        const currentProgress = Math.min((elapsed / totalTime) * 100, 100);

        setProgress(currentProgress);

        if (currentProgress >= 100) {
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

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [paused, index, highlights.length]);

  /*
   * Move to next highlight.
   */
  const nextHighlight = () => {
    if (index >= highlights.length - 1) {
      setProgress(100);

      /*
       * Only mark someone else's highlight as viewed.
       * Your own highlight cannot be "viewed by yourself".
       */
      if (owner === "other") {
        dispatch(markAsSeen(ownerId));
      }

      onComplete();

      return;
    }

    setIndex((prev) => prev + 1);
    setProgress(0);
  };

  /*
   * Move to previous highlight.
   */
  const prevHighlight = () => {
    setIndex((prev) => (prev === 0 ? highlights.length - 1 : prev - 1));

    setProgress(0);
  };

  /*
   * Left side = previous
   * Right side = next
   */
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;

    if (x < rect.width / 3) {
      prevHighlight();
    } else if (x > (2 * rect.width) / 3) {
      nextHighlight();
    }
  };

  /*
   * Nothing to display.
   */
  if (highlights.length === 0) {
    return null;
  }

  const currentHighlight = highlights[index];

  useEffect(() => {
    if (owner === "other" && currentHighlight) {
      markAsView(currentHighlight.id);
    }
  }, [currentHighlight, owner]);

  function formatTime(time: string): string {
    const date = new Date(time);
    const now = new Date();

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const isToday: boolean =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isToday) {
      return `Today, ${timeString}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday: boolean =
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    if (isYesterday) {
      return `Yesterday, ${timeString}`;
    }

    const dateString = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${dateString}, ${timeString}`;
  }

const highlightDetails: HighlightDetails = {
  displayName:
    owner === "self"
      ? user?.displayName ?? "You"
      : friend?.displayName ?? "",

  username:
    owner === "self"
      ? user?.username ?? ""
      : friend?.username ?? "",

  time: formatTime(currentHighlight.createdAt),
};
  return (
    <div
      className={`fixed inset-0 z-99 flex flex-col justify-center items-center bg-$ bg-cover bg-center`}
      style={{
        backgroundColor: currentHighlight.background ?? "black",
      }}
      onClick={handleClick}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* Progress bars */}
      <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
        {highlights.map((_, i) => {
          const width = i < index ? 100 : i === index ? progress : 0;

          return (
            <div
              key={i}
              className="flex-1 h-2 bg-white/30 rounded overflow-hidden"
            >
              <div
                className="h-full bg-white rounded"
                style={{
                  width: `${width}%`,
                }}
              />
            </div>
          );
        })}
      </div>
     <div className="details absolute top-9 left-10 text-white">
  <div className="flex items-center gap-2">
    <h3 className="text-2xl mb-0 leading-none font-bold pb-0">
      {highlightDetails.displayName}
    </h3>

    <p className="time">
      {highlightDetails.time}
    </p>
  </div>

  <h4 className="pb-0 mb-0 leading-none text-sm">
    @{highlightDetails.username}
  </h4>
</div>
      {/* Text highlight */}
      {currentHighlight.type === "text" && (
        <p className="text-white text-center text-3xl font-semibold drop-shadow-lg px-4 max-w-[90%] wrap-break-word">
          {currentHighlight.caption}
        </p>
      )}

      {/* Image highlight */}
      {currentHighlight.type === "image" && (
        <img
          src={currentHighlight.mediaUrl ?? ""}
          alt={currentHighlight.caption ?? "Highlight"}
          className="max-h-[80vh] max-w-[90vw] object-contain"
        />
      )}

      {/* Video highlight */}
      {currentHighlight.type === "video" && (
        <video
          src={currentHighlight.mediaUrl ?? ""}
          className="max-h-[80vh] max-w-[90vw] object-contain"
          autoPlay
          playsInline
        />
      )}

      {/* Owner name */}
      <p className="absolute bottom-8 text-white text-lg font-medium drop-shadow-md">
        {owner === "self" ? "You" : friend?.displayName}
      </p>
    </div>
  );
};

export default HighLightView;
