import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";

import PhotoHolder from "../Components/PhotoHolder";
import ChatMessage from "../Components/ChatBubble";
import useInternetConnection from "../hooks/InternetStatus.hook";
import { useSocket } from "../hooks/useSocket";

import type { RootState } from "../Store/store";
import type { Message } from "../Types/Message.type";
import type { Participant } from "../Types/Conversation.type";

import { apiFetch } from "../utils/api";

import {
  setMessages,
  appendMessage,
  updateMessage,
} from "../Store/Slices/Messages.slice";

import {
  setCurrentConversation,
  setConversations,
  clearCurrentConversation,
  resetUnreadCount,
} from "../Store/Slices/Conversations.slice";

import {
  loadMessagesForConversation,
  saveMessagesForConversation,
  loadCurrentConversation,
  loadConversations,
  saveCurrentConversation,
} from "../services/localStorageService";

import { Send, Database, ArrowDown } from "lucide-react";
import { setActiveConversation } from "../services/socketEmittersService";

const apiVersion = import.meta.env.VITE_API_VERSION;
const EMPTY: Message[] = [];
const INVALID = "noConversation";

const ChatLayout = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<Participant | null>(null);
  const [recovered, setRecovered] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const joinedRoomRef = useRef(false);
  const isUserScrollingRef = useRef(false);

  const { socket, isConnected } = useSocket();
  const { online } = useInternetConnection();

  const currentConversation = useSelector(
    (s: RootState) => s.conversations.currentConversation,
  );

  const messages = useSelector((state: RootState) =>
    currentConversation?.id && currentConversation.id !== INVALID
      ? state.messages[currentConversation.id] || EMPTY
      : EMPTY,
  );

  const appUserId = useSelector((s: RootState) => s.user.user?.id);

  const conversationId = currentConversation?.id

  // RESET NEW MESSAGES COUNT
  useEffect(() => {
    if (!conversationId || conversationId === INVALID) return;

    dispatch(resetUnreadCount(conversationId));
  }, [conversationId, dispatch]);

  // ========== Local Storage Helpers ==========
  const cacheMessages = (id: string, msgs: Message[]) =>
    saveMessagesForConversation(id, msgs);

  const loadCachedMessages = (id: string) =>
    loadMessagesForConversation(id) || [];

  // ========== Recovery ==========
  const recover = useCallback(() => {
    let found = false;

    const savedConv = loadCurrentConversation();
    if (savedConv && savedConv.id !== INVALID) {
      dispatch(setCurrentConversation(savedConv));
      found = true;
    }

    const savedList = loadConversations();
    if (savedList?.length) {
      dispatch(setConversations(savedList));
      found = true;
    }

    if (conversationId) {
      const cached = loadCachedMessages(conversationId);
      if (cached.length) {
        dispatch(setMessages({ conversationId, messages: cached }));
        found = true;
      }
    }

    setRecovered(found);
    setTimeout(() => setRecovered(false), 2000);
  }, [dispatch, conversationId]);

  // useEffect(() => {
  //   recover();
  // }, []);

  useEffect(()=> {
    if(socket && conversationId && conversationId !== INVALID) {
      setActiveConversation(socket,  conversationId);
       return () => {
      setActiveConversation(socket, null);
    };
    }

  },[conversationId, socket]);
  
  // ========== Set other user ==========
  useEffect(() => {
    if (!currentConversation?.participants || !appUserId) return;

    const other = currentConversation.participants.find(
      (p) => p.id !== appUserId,
    );

    setOtherUser(other || null);
  }, [currentConversation, appUserId]);

  // ========== Save current conversation ==========
  useEffect(() => {
    if (currentConversation?.id && currentConversation.id !== INVALID) {
      saveCurrentConversation(currentConversation);
    }
  }, [currentConversation]);

  // ========== Socket: Join conversation room ==========
  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;
    if (conversationId === INVALID) return;
    if (joinedRoomRef.current) return;

    socket.emit("join_conversation", conversationId);
    joinedRoomRef.current = true;
  }, [socket, isConnected, conversationId]);

  // ========== Fetch messages ==========
  useEffect(() => {
    if (!conversationId || conversationId === INVALID) {
      setLoading(false);
      return;
    }

    const cached = loadCachedMessages(conversationId);

    if (cached.length) {
      dispatch(setMessages({ conversationId, messages: cached }));
    }

    const fetch = async () => {
      try {
        console.log("Fetching messages from API for conversation:", conversationId);
        const res = await apiFetch(
          `/conversations/${conversationId}/messages`,
        );

        if (res.data.success) {
          dispatch(
            setMessages({
              conversationId,
              messages: res.data.messages,
            }),
          );

          cacheMessages(conversationId, res.data.messages);
        }
      } catch (e) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [conversationId]);

  // ========== Send message ==========
  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;
    if (conversationId === INVALID) return;

    const tempId = uuid();

    const msg: Message = {
      id: tempId,
      conversationId,
      senderId: appUserId || "",
      content: input,
      status: online ? "sending" : "pending",
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(appendMessage({ conversationId, message: msg }));
    setInput("");

    // Scroll to bottom after sending
    setTimeout(() => {
      scrollToBottom();
    }, 150);

    if (!online) return;

    try {
      const res = await apiFetch(`/messages/${conversationId}`, {
        method: "POST",
        body: JSON.stringify({
          conversationId,
          content: msg.content,
        }),
      });

      if (res.data.success) {
        dispatch(
          updateMessage({
            conversationId,
            tempId,
            message: res.data.message,
          }),
        );

        const cached = loadCachedMessages(conversationId);
        cacheMessages(
          conversationId,
          cached.map((m) => (m.id === tempId ? res.data.message : m)),
        );
      }
    } catch (e) {
      dispatch(
        updateMessage({
          conversationId,
          tempId,
          message: { ...msg, status: "failed" },
        }),
      );
    }
  };

  // ========== Scroll to bottom function ==========
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
      isUserScrollingRef.current = false;
    }
  }, []);

  // ========== Handle scroll events ==========
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (isNearBottom) {
      setShowScrollButton(false);
      isUserScrollingRef.current = false;
    } else {
      setShowScrollButton(true);
      isUserScrollingRef.current = true;
    }
  }, []);

  // ========== Auto scroll to bottom on new messages ==========
  useEffect(() => {
    // Only auto-scroll if user is not manually scrolling
    // and bottomRef exists
    if (!isUserScrollingRef.current && bottomRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant" });
      });
    }
  }, [messages.length]);

  // ========== Scroll to bottom when messages are first loaded ==========
  useEffect(() => {
    if (!loading && messages.length > 0 && bottomRef.current) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant" });
      });
    }
  }, [loading, messages.length]);

  // ========== Clear on unmount ==========
  useEffect(() => {
    return () => {
      dispatch(clearCurrentConversation());
    };
  }, [dispatch]);

  // ========== UI States ==========
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2a51ff] border-t-transparent"></div>
      </div>
    );
  }

  if (!conversationId || conversationId === INVALID) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">No conversation selected</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-[#2a51ff] text-white rounded-lg hover:bg-[#1a3fd9] transition"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <section className="h-screen flex flex-col bg-home">
      <header className="bg-white px-4 py-3 shadow-xl flex items-center gap-2 border-b border-gray-200">
        <PhotoHolder username={otherUser?.username || "User"} css="h-11 w-11" />
        <div className="flex-1">
          <h2 className="text-xl font-medium">
            {otherUser?.displayName || otherUser?.username || "Loading..."}
          </h2>
        </div>
        <button
          onClick={recover}
          className={`p-2 rounded-full transition ${
            recovered
              ? "text-green-500 bg-green-50"
              : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
          }`}
          title="Recover data from cache"
        >
          <Database size={18} />
        </button>
      </header>

      <main
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 relative"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
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
            <p className="text-gray-500 text-center">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Say hello to start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                username={
                  msg.senderId === appUserId
                    ? "You"
                    : otherUser?.username || "User"
                }
                senderId={msg.senderId}
                text={msg.content}
                time={msg.createdAt}
                status={msg.status}
              />
            ))}
            <div ref={bottomRef} />
          </>
        )}

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 p-3 bg-[#2a51ff] text-white rounded-full shadow-lg hover:bg-[#1a3fd9] transition-all transform hover:scale-110 active:scale-95 z-10"
            aria-label="Scroll to bottom"
          >
            <ArrowDown size={20} />
          </button>
        )}
      </main>

      <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={
            online
              ? "Type a message..."
              : "You're offline. Message will send when online."
          }
          className="flex-1 h-10 px-4 rounded-full border border-gray-300 outline-none focus:ring-1 focus:ring-[#2a51ff] font-gfont disabled:bg-gray-100"
          disabled={!online && !input.trim()}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-[#2a51ff] text-white hover:bg-[#1a3fd9] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </section>
  );
};

export default ChatLayout;
