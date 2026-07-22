export interface Participant {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: Participant[];  // Now array of objects, not strings
  nickname?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline?: boolean;
  settings: {
    isMuted: boolean;
    isPinned: boolean;
    isArchived: boolean;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}