import type { Conversation } from "../Types/Conversation.type";


export const mockConversations:Conversation[] = [
  {
    id: "c1",
    participants: ["me", "u1"],
    lastMessage: "See you later!",
    lastMessageTime: "2024-01-29T10:00:00Z",
    unreadCount: 1,
    settings: { isMuted: false },
  },
  {
    id: "c2",
    participants: ["me", "u2"],
    lastMessage: "Thanks!",
    lastMessageTime: "2024-01-28T20:30:00Z",
    unreadCount: 0,
    settings: { isMuted: false },
  },
  {
    id: "c3",
    participants: ["me", "u3"],
    lastMessage: "Got it.",
    lastMessageTime: "2024-01-28T19:15:00Z",
    unreadCount: 2,
    settings: { isMuted: true },
  },
];