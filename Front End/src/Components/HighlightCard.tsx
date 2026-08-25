import React, { useState } from "react";

import PhotoHolder from "./PhotoHolder";
import HighLightView from "./HighLightView";

import type { Highlight } from "../Types/Highlights.types";
import { CloudCog } from "lucide-react";

type Props = {
  id: string; //it is the friendId
  name: string;
  highlights: Highlight[];

};

const HighlightCard = React.memo(({ id, name, highlights }: Props) => {
  const [showHighlight, setShowHighlight] = useState(false);

  const latestHighlight = highlights[0];

  function changeHighlight() {
    setShowHighlight(true);
  }

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

  return (
    <>
      {showHighlight && (
        <HighLightView
          ownerId={id}
          owner="other"
          onComplete={() => setShowHighlight(false)}
        />
      )}

      <div
        className="highlightCard flex gap-5 px-1 py-1 mt-4 hover:bg-white"
        onClick={changeHighlight}
      >
        <div className="avatar relative">
          <PhotoHolder css="h-12 w-12" username={name} />

          {highlights.length > 0 && (
            <div className="highlightCount absolute h-5 w-5 right-0 bottom-0 rounded-full bg-[#9810FA] border border-gray-300 flex justify-center items-center text-[12px] text-white">
              {highlights.length}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h2 className="font-semibold">{name}</h2>

          <p className="text-gray-500 text-[13px] font-semibold">
            {formatTime(latestHighlight?.createdAt)}
          </p>
        </div>
      </div>
    </>
  );
});

export default HighlightCard;
