import { useSelector } from "react-redux";
import { useState } from "react";
import type { RootState } from "../Store/store";
import PhotoHolder from "../Components/PhotoHolder";
import { Send } from "lucide-react";
import type { ChatPartner } from "../Types/ChatPartner.type";
import { mockMessages } from "../MockData/MockMessages";
import ChatMessage from "../Components/ChatBubble";
import type { Message } from "../Types/Message.type";
import { v4 as uuid } from "uuid"; // to generate unique ids

const ChatLayout = () => {
  const chatPartner = useSelector((state: RootState) => state.chatPartner) as ChatPartner;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages[chatPartner.id] || []);

  // Add a new message
  function addMsg(text: string) {
    if (!text.trim()) return;

    const newMsg: Message = {
      id: uuid(),
      conversationId: chatPartner.id, // reference to the contact
      senderId: "me",
      textContent: text,
      timestamp: new Date().toISOString(),
      status: "Sent",
    };

    // update local state
    setMessages([newMsg, ...messages]); // because your main is flex-col-reverse

    // update mockMessages (optional for mock)
    if (!mockMessages[chatPartner.id]) mockMessages[chatPartner.id] = [];
    mockMessages[chatPartner.id].unshift(newMsg); // add at start for reverse layout

    setInput(""); // clear input
  }

  return (
    <section className="h-screen w-screen flex flex-col">
      <header className="bg-white px-4 py-3 shadow-xl flex gap-2 items-center">
        <PhotoHolder username={chatPartner.username || 'Test User'} css="h-11 w-11" />
        <div>
          <h2 className="text-xl font-medium font-gfont">{chatPartner.username || 'Test User'}</h2>
          <p className="text-sm text-gray-500 font-gfont">{chatPartner.isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </header>

      <main className="bg-home h-full flex flex-col-reverse overflow-y-auto p-3">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            username={msg.senderId}
            text={msg.textContent}
            time={msg.timestamp}
            isOwnMessage={msg.senderId === "me"}
          />
        ))}
      </main>

      <div className="flex items-center gap-2 px-3 py-2">
        <input
          type="text"
          placeholder="Type message…"
          className="flex-1 h-10 px-4 rounded-full border border-gray-400 outline-none focus:ring-1 focus:ring-[#9D55FF] font-gfont"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addMsg(input)} // send on Enter
        />
        <button
          type="button"
          className="h-10 w-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-[#9D55FF] hover:bg-[#9D55FF]/10 transition"
          onClick={() => addMsg(input)}
        >
          <Send stroke="#9D55FF" size={20} />
        </button>
      </div>
    </section>
  );
};

export default ChatLayout;
