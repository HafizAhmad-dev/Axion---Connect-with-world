import { useSelector } from "react-redux";
import type { RootState } from "../Store/store";
import React from "react";
import type { Status } from "../Types/Message.type";

interface ChatBubbleProps {
  username: string;
  text: string;
  time: string;
  senderId: string;
  status: Status;
}

export default React.memo(function ChatBubble({
  username,
  text,
  time,
  senderId,
  status,
}: ChatBubbleProps) {
  const appUserId = useSelector((state: RootState) => state.user.id);
  const isOwnMsg = senderId === appUserId;

  return (
    <div
      className={`flex ${isOwnMsg ? "justify-end" : "justify-start"} mb-2 px-3`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-xl wrap-break-word shadow-sm
        ${isOwnMsg ? "bg-[#9D55FF] text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}
      >
        <p className="text-sm font-gfont">{text}</p>
        <div className="flex justify-between gap-3 items-end text-xs opacity-80 mt-1">
          {!isOwnMsg && <span className="font-semibold">{username}</span>}
          {isOwnMsg && <span className="font-semibold">{status}</span>}
          <span>
            {new Date(time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
});
