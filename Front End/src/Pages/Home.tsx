// Home.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { Conversation, Participant } from "../Types/Conversation.type";
import {
  setConversations,
  setCurrentConversation,
} from "../Store/Slices/Conversations.slice";
import { useEffect } from "react";
import type { RootState } from "../Store/store";
import { apiFetch } from "../utils/api";
import { selectUser } from "../Store/Slices/UserSlice";
import PhotoHolder from "../Components/PhotoHolder";
import SearchUser from "../Components/SearchUser.input";
import AnimatedSearchPanel from "../Components/AnimatedSearchPanel";
import { saveCurrentConversation } from "../services/localStorageService";
import { useSocket } from "../hooks/useSocket";
const apiVersion = import.meta.env.VITE_API_VERSION;

const Home = () => {
  // ========== State ==========
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // ========== Hooks ==========
  // const { socket, isConnected } = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const conversations = useSelector(
    (state: RootState) => state.conversations.conversations,
  );
  const messages = useSelector((state: RootState) => state.messages);



  // ========== Fetch all conversations ==========
  useEffect(() => {
    if (!user) return;

    async function fetchConversations() {
      setLoading(true);
      try {
        const response = await apiFetch(`/${apiVersion}/conversations`);
        const data: Conversation[] =
          response.data.conversations || response.data;
        dispatch(setConversations(data));
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [user, dispatch]);



  // ========== Open chat ==========
  const openChat = (conversation: Conversation) => {
    dispatch(setCurrentConversation(conversation));
    saveCurrentConversation(conversation);
    navigate(`/user/chat/${conversation.id}`);
  };

  // ========== Get display name ==========
  const getDisplayName = (conversation: Conversation): string => {
    if (conversation.nickname) {
      return conversation.nickname;
    }

    const otherParticipant = conversation.participants?.find(
      (p: Participant) => p.id !== user?.id,
    );

    if (otherParticipant) {
      return otherParticipant.displayName || otherParticipant.username;
    }

    return "Chat";
  };

  // ========== Format time ==========
  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) return null;

  return (
    <div className="bg-home pb-10 h-full pt-3 px-3 relative">
      {/* Only show search bar when panel is closed */}
      {!isSearchOpen && (
        <SearchUser
          query={searchQuery}
          setQuery={setSearchQuery}
          onClick={() => setIsSearchOpen(true)}
        />
      )}

      {/* Animated Search Panel */}
      <AnimatedSearchPanel
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery("");
        }}
        query={searchQuery}
        setQuery={setSearchQuery}
      />

      {/* Conversations List - Blur when searching */}
      <div
        className={`usersList flex flex-col gap-2 mt-2 max-h-full pt-2 overflow-auto no-scrollbar transition-all duration-300 ${
          isSearchOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2a51ff] border-t-transparent"></div>
          </div>
        )}

        {/* No Conversations */}
        {!loading && conversations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Search for users to start chatting
            </p>
          </div>
        )}


        {!loading &&
          conversations.length > 0 &&
        conversations.map((convo) => {
            const displayName = getDisplayName(convo);

            return (
              <div
                key={convo.id}
                onClick={() => openChat(convo)}
                className="User select-none flex justify-between px-2 py-2 hover:shadow-usercard rounded-xl cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <PhotoHolder
                    css="h-12 w-12 bg-gradient-to-br from-teal-400 to-blue-500 flex-shrink-0"
                    username={displayName}
                  />
                  <div className="main">
                    <h2 className="font-semibold text-gray-800">
                      {displayName}
                    </h2>
                    <p className="text-sm text-gray-500 truncate max-w-50">
                      {convo.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>

                <div className="right flex flex-col justify-center items-end">
                  {convo.unreadCount > 0 && (
                    <p className="unreadMsgsCount text-center text-xs rounded-full h-5 w-5 bg-linear-to-br from-[#2a51ff] to-blue-600 text-white font-semibold flex items-center justify-center">
                      {convo.unreadCount > 99 ? "99+" : convo.unreadCount}
                    </p>
                  )}
                  <p
                    className={`time text-xs text-gray-400 font-medium ${
                      convo.unreadCount ? "mt-1" : "mt-4"
                    }`}
                  >
                    {convo.lastMessageTime
                      ? formatMessageTime(convo.lastMessageTime)
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
