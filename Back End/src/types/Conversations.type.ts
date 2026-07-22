export interface Conversation {
  id: string;
  participants: string[];
  nickname?: string;  // ← Add this (per-user nickname for personal chats)
  lastMessage?: string;
  unreadCount: number;
  lastMessageTime: string;
  isOnline: boolean;
  settings: Settings;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  isMuted: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
}