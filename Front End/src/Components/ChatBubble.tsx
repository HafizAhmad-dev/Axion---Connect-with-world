
interface ChatBubbleProps {
  username: string;
  text: string;
  time: string;
  isOwnMessage?: boolean; // if true, aligns right
}

export default function ChatBubble({
  text,
  time,
  isOwnMessage = false,
}: ChatBubbleProps) {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2 px-3`}>
      <div
        className={`max-w-[70%] p-3 rounded-xl wrap-break-word shadow-sm
        ${isOwnMessage ? "bg-[#9D55FF] text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}
      >
    
        <p className="text-sm font-gfont">{text}</p>
            <div className="flex justify-between items-end text-xs opacity-80 mt-1">
          {/* <span className="font-semibold">{username}</span> */}
          <span>{new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  );
}
