
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";
import { ArrowDown, Send } from "lucide-react";

import PhotoHolder from "../Components/PhotoHolder";
import ChatMessage from "../Components/ChatBubble";

import useInternetConnection from "../hooks/InternetStatus.hook";
import { useSocket } from "../hooks/useSocket";

import type { RootState } from "../Store/store";
import type {
  Message,
  SendMessageApiResponse,
  ApiMessagesResponse,
} from "../Types/Message.type";

import { apiFetch } from "../utils/api";

import {
  setMessages,
  appendMessage,
  updateMessage,
} from "../Store/Slices/Messages.slice";

import {
  clearCurrentConversation,
  resetUnreadCount,
} from "../Store/Slices/Conversations.slice";

import {
  loadMessagesForConversation,
  saveMessagesForConversation,
  saveCurrentConversation,
} from "../services/localStorageService";

import { setActiveConversation } from "../services/socketEmittersService";

const INVALID_CONVERSATION = "noConversation";

const ChatLayout = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isUserScrollingRef = useRef(false);

  const { socket, isConnected } = useSocket();
  const { online } = useInternetConnection();

  const currentConversation = useSelector(
    (state: RootState) => state.conversations.currentConversation,
  );

  const appUserId = useSelector(
    (state: RootState) => state.user.user?.id,
  );

  const conversationId = currentConversation?.id;

  const messages = useSelector((state: RootState) =>
    conversationId && conversationId !== INVALID_CONVERSATION
      ? state.messages[conversationId] || []
      : [],
  );

  // Find the other participant.
  const otherUser = currentConversation?.participants?.find(
    (participant) => participant.id !== appUserId,
  );

  // Reset unread messages.
  useEffect(() => {
    if (!conversationId || conversationId === INVALID_CONVERSATION) {
      return;
    }

    dispatch(resetUnreadCount(conversationId));
  }, [conversationId, dispatch]);

  // Save the selected conversation.
  useEffect(() => {
    if (
      currentConversation?.id &&
      currentConversation.id !== INVALID_CONVERSATION
    ) {
      saveCurrentConversation(currentConversation);
    }
  }, [currentConversation]);

  // Set the active conversation.
  useEffect(() => {
    if (!socket || !conversationId || conversationId === INVALID_CONVERSATION) {
      return;
    }

    setActiveConversation(socket, conversationId);

    return () => {
      setActiveConversation(socket, null);
    };
  }, [socket, conversationId]);

  // Join the conversation room.
  useEffect(() => {
    if (
      !socket ||
      !isConnected ||
      !conversationId ||
      conversationId === INVALID_CONVERSATION
    ) {
      return;
    }

    socket.emit("join_conversation", conversationId);
  }, [socket, isConnected, conversationId]);

  // Fetch messages and restore cached messages.
  useEffect(() => {
    if (!conversationId || conversationId === INVALID_CONVERSATION) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);

    const cachedMessages =
      loadMessagesForConversation(conversationId) || [];

    if (cachedMessages.length > 0) {
      dispatch(
        setMessages({
          conversationId,
          messages: cachedMessages,
        }),
      );
    }

    const fetchMessages = async () => {
      try {
        const response = await apiFetch<ApiMessagesResponse>(
          `/conversations/${conversationId}/messages`,
        );

        if (cancelled) return;

        if (response.data.success) {
          dispatch(
            setMessages({
              conversationId,
              messages: response.data.messages,
            }),
          );

          saveMessagesForConversation(
            conversationId,
            response.data.messages,
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch messages:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [conversationId, dispatch]);

  // Scroll to the latest message.
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    setShowScrollButton(false);
    isUserScrollingRef.current = false;
  }, []);

  // Track user scrolling.
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    const isNearBottom =
      scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollButton(!isNearBottom);
    isUserScrollingRef.current = !isNearBottom;
  }, []);

  // Automatically scroll when new messages arrive.
  useEffect(() => {
    if (isUserScrollingRef.current || !bottomRef.current) return;

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    });
  }, [messages.length]);

  // Scroll after initial message loading.
  useEffect(() => {
    if (loading || messages.length === 0) return;

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    });
  }, [loading, messages.length]);

  // Send a message.
  const sendMessage = async () => {
    const content = input.trim();

    if (
      !content ||
      !online ||
      !conversationId ||
      conversationId === INVALID_CONVERSATION
    ) {
      return;
    }

    const clientMessageId = uuid();
    const now = new Date().toISOString();

    const optimisticMessage: Message = {
      id: clientMessageId,
      clientMessageId,
      conversationId,
      senderId: appUserId || "",
      content,
      status: "sending",
      isRead: false,
      createdAt: now,
      updatedAt: now,
    };

    // Immediately update the UI.
    dispatch(
      appendMessage({
        conversationId,
        message: optimisticMessage,
      }),
    );

    setInput("");

    // Persist optimistic message.
    const cachedMessages =
      loadMessagesForConversation(conversationId) || [];

    saveMessagesForConversation(conversationId, [
      ...cachedMessages,
      optimisticMessage,
    ]);

    requestAnimationFrame(scrollToBottom);

    try {
      const response = await apiFetch<SendMessageApiResponse>(
        `/messages/${conversationId}`,
        {
          method: "POST",
          body: JSON.stringify({
            conversationId,
            content,
            clientMessageId,
          }),
        },
      );

      if (!response.data.success) {
        throw new Error("Message sending failed");
      }

      const serverMessage = response.data.message;

      // Replace optimistic message with the server message.
      dispatch(
        updateMessage({
          conversationId,
          clientMessageId,
          message: serverMessage,
        }),
      );

      // Update cached message.
      const latestCache =
        loadMessagesForConversation(conversationId) || [];

      saveMessagesForConversation(
        conversationId,
        latestCache.map((message) =>
          message.clientMessageId === clientMessageId
            ? serverMessage
            : message,
        ),
      );
    } catch (error) {
      console.error("Failed to send message:", error);

      // Mark optimistic message as failed.
      const failedMessage: Message = {
        ...optimisticMessage,
        status: "failed",
      };

      dispatch(
        updateMessage({
          conversationId,
          clientMessageId,
          message: failedMessage,
        }),
      );

      const latestCache =
        loadMessagesForConversation(conversationId) || [];

      saveMessagesForConversation(
        conversationId,
        latestCache.map((message) =>
          message.clientMessageId === clientMessageId
            ? failedMessage
            : message,
        ),
      );
    }
  };

  // Clear selected conversation on unmount.
  useEffect(() => {
    return () => {
      dispatch(clearCurrentConversation());
    };
  }, [dispatch]);

  // Loading state.
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2a51ff] border-t-transparent" />
      </div>
    );
  }

  // No conversation selected.
  if (!conversationId || conversationId === INVALID_CONVERSATION) {
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
      {/* Chat header */}
      <header className="bg-white px-4 py-3 shadow-xl flex items-center gap-2 border-b border-gray-200">
        <PhotoHolder
          username={otherUser?.username || "User"}
          css="h-11 w-11"
        />

        <div className="flex-1">
          <h2 className="text-xl font-medium">
            {otherUser?.displayName ||
              otherUser?.username ||
              "Loading..."}
          </h2>
        </div>
      </header>

      {/* Messages */}
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

            <p className="text-gray-500 text-center">
              No messages yet
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Say hello to start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id || message.clientMessageId}
                username={
                  message.senderId === appUserId
                    ? "You"
                    : otherUser?.username || "User"
                }
                senderId={message.senderId}
                text={message.content}
                time={message.createdAt}
                status={message.status}
              />
            ))}

            <div ref={bottomRef} />
          </>
        )}

        {/* Scroll to bottom */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className="absolute bottom-4 right-4 p-3 bg-[#2a51ff] text-white rounded-full shadow-lg hover:bg-[#1a3fd9] transition-all transform hover:scale-110 active:scale-95 z-10"
          >
            <ArrowDown size={20} />
          </button>
        )}
      </main>

      {/* Message input */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage();
            }
          }}
          placeholder={
            online
              ? "Type a message..."
              : "You're offline. Reconnect to send messages."
          }
          className="flex-1 h-10 px-4 rounded-full border border-gray-300 outline-none focus:ring-1 focus:ring-[#2a51ff] font-gfont disabled:bg-gray-100"
        />

        <button
          onClick={() => void sendMessage()}
          disabled={!input.trim() || !online}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-[#2a51ff] text-white hover:bg-[#1a3fd9] transition disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </section>
  );
};

export default ChatLayout;
