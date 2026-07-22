import type { Message } from "../Types/Message.type";
import type { Conversation, Participant } from "../Types/Conversation.type";
import type { Friend } from "../Types/Friend.type";

// ============ Storage Keys ============
const STORAGE_KEYS = {
  USER: "app_user",
  FRIENDS: "chat_friends",
  CONVERSATIONS: "chat_conversations",
  CURRENT_CONVERSATION: "chat_current_conversation",
  MESSAGES: "chat_messages",
  FRIEND_REQUESTS: "chat_friend_requests",
  PENDING_ACTIONS: "chat_pending_actions",
};

// ============ Helper: Convert Date to ISO String ============
const toISOString = (date: string | Date): string => {
   if (!date) {
    return 'Invalid Date'
  }
  return typeof date === "string" ? date : date.toISOString();
};

// ============ Generic Helpers ============
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

export const loadFromLocalStorage = (key: string): any => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage:`, error);
  }
};

export const clearAllStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};

// ============ User Storage ============
export const saveUser = (user: any): void => {
  saveToLocalStorage(STORAGE_KEYS.USER, user);
};

export const loadUser = (): any => {
  return loadFromLocalStorage(STORAGE_KEYS.USER);
};

export const removeUser = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.USER);
};

// ============ Friends Storage ============
export interface StoredFriend {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  createdAt?: string;
}

export const saveFriends = (friends: StoredFriend[]): void => {
  saveToLocalStorage(STORAGE_KEYS.FRIENDS, {
    data: friends,
    lastUpdated: new Date().toISOString(),
  });
};

export const loadFriends = (): StoredFriend[] => {
  const stored = loadFromLocalStorage(STORAGE_KEYS.FRIENDS);
  return stored?.data || [];
};

export const getFriendsLastUpdated = (): string | null => {
  const stored = loadFromLocalStorage(STORAGE_KEYS.FRIENDS);
  return stored?.lastUpdated || null;
};

export const addFriendToStorage = (friend: StoredFriend): void => {
  const currentFriends = loadFriends();
  const exists = currentFriends.some((f) => f.id === friend.id);
  if (!exists) {
    saveFriends([...currentFriends, friend]);
  }
};

export const updateFriendInStorage = (
  friendId: string,
  updates: Partial<StoredFriend>,
): void => {
  const currentFriends = loadFriends();
  const updatedFriends = currentFriends.map((friend) =>
    friend.id === friendId ? { ...friend, ...updates } : friend,
  );
  saveFriends(updatedFriends);
};

export const removeFriendFromStorage = (friendId: string): void => {
  const currentFriends = loadFriends();
  const updatedFriends = currentFriends.filter(
    (friend) => friend.id !== friendId,
  );
  saveFriends(updatedFriends);
};

// ============ Friend Requests Storage ============
export interface StoredFriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  username: string;
  displayName: string;
  avatar?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export const saveFriendRequests = (requests: StoredFriendRequest[]): void => {
  saveToLocalStorage(STORAGE_KEYS.FRIEND_REQUESTS, {
    data: requests,
    lastUpdated: new Date().toISOString(),
  });
};

export const loadFriendRequests = (): StoredFriendRequest[] => {
  const stored = loadFromLocalStorage(STORAGE_KEYS.FRIEND_REQUESTS);
  return stored?.data || [];
};

export const addFriendRequestToStorage = (
  request: StoredFriendRequest,
): void => {
  const currentRequests = loadFriendRequests();
  const exists = currentRequests.some((r) => r.id === request.id);
  if (!exists) {
    saveFriendRequests([...currentRequests, request]);
  }
};

export const removeFriendRequestFromStorage = (requestId: string): void => {
  const currentRequests = loadFriendRequests();
  const updatedRequests = currentRequests.filter((r) => r.id !== requestId);
  saveFriendRequests(updatedRequests);
};

export const updateFriendRequestStatus = (
  requestId: string,
  status: "accepted" | "rejected",
): void => {
  const currentRequests = loadFriendRequests();
  const updatedRequests = currentRequests.map((request) =>
    request.id === requestId ? { ...request, status } : request,
  );
  saveFriendRequests(updatedRequests);
};

// ============ Pending Actions Storage (Offline Sync) ============
export interface PendingAction {
  id: string;
  type:
    | "SEND_FRIEND_REQUEST"
    | "ACCEPT_FRIEND_REQUEST"
    | "REJECT_FRIEND_REQUEST"
    | "SEND_MESSAGE";
  payload: any;
  timestamp: string;
}

export const savePendingAction = (action: PendingAction): void => {
  const pending = loadPendingActions();
  const exists = pending.some((a) => a.id === action.id);
  if (!exists) {
    saveToLocalStorage(STORAGE_KEYS.PENDING_ACTIONS, [...pending, action]);
  }
};

export const loadPendingActions = (): PendingAction[] => {
  return loadFromLocalStorage(STORAGE_KEYS.PENDING_ACTIONS) || [];
};

export const removePendingAction = (actionId: string): void => {
  const pending = loadPendingActions();
  const updated = pending.filter((action) => action.id !== actionId);
  saveToLocalStorage(STORAGE_KEYS.PENDING_ACTIONS, updated);
};

export const clearAllPendingActions = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.PENDING_ACTIONS);
};

// ============ Conversations Storage ============
export interface StoredConversation {
  id: string;
  participants: Participant[];
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
  createdAt: string;
  updatedAt: string;
}

export const saveConversations = (conversations: Conversation[]): void => {
  const storedConversations: StoredConversation[] = conversations.map(
    (conv) => ({
      id: conv.id,
      participants: conv.participants,
      nickname: conv.nickname,
      lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime,
      unreadCount: conv.unreadCount,
      isOnline: conv.isOnline,
      settings: {
        isMuted: conv.settings.isMuted,
        isPinned: conv.settings.isPinned ?? false,
        isArchived: conv.settings.isArchived ?? false,
      },
      createdAt: toISOString(conv.createdAt),
      updatedAt: toISOString(conv.updatedAt),
    }),
  );

  saveToLocalStorage(STORAGE_KEYS.CONVERSATIONS, {
    data: storedConversations,
    lastUpdated: new Date().toISOString(),
  });
};

export const loadConversations = (): Conversation[] => {
  const stored = loadFromLocalStorage(STORAGE_KEYS.CONVERSATIONS);
  const storedConversations = stored?.data || [];

  return storedConversations.map((stored: StoredConversation) => ({
    id: stored.id,
    participants: stored.participants,
    nickname: stored.nickname,
    lastMessage: stored.lastMessage,
    lastMessageTime: stored.lastMessageTime,
    unreadCount: stored.unreadCount,
    isOnline: stored.isOnline,
    settings: {
      isMuted: stored.settings.isMuted,
      isPinned: stored.settings.isPinned,
      isArchived: stored.settings.isArchived,
    },
    createdAt: stored.createdAt,
    updatedAt: stored.updatedAt,
  }));
};

export const saveCurrentConversation = (
  conversation: Conversation | null,
): void => {
  if (conversation) {
    const storedConv: StoredConversation = {
      id: conversation.id,
      participants: conversation.participants,
      nickname: conversation.nickname,
      lastMessage: conversation.lastMessage,
      lastMessageTime: conversation.lastMessageTime,
      unreadCount: conversation.unreadCount,
      isOnline: conversation.isOnline,
      settings: {
        isMuted: conversation.settings.isMuted,
        isPinned: conversation.settings.isPinned ?? false,
        isArchived: conversation.settings.isArchived ?? false,
      },
      createdAt: toISOString(conversation.createdAt),
      updatedAt: toISOString(conversation.updatedAt),
    };
    saveToLocalStorage(STORAGE_KEYS.CURRENT_CONVERSATION, storedConv);
  } else {
    removeFromLocalStorage(STORAGE_KEYS.CURRENT_CONVERSATION);
  }
};

export const loadCurrentConversation = (): Conversation | null => {
  const stored = loadFromLocalStorage(STORAGE_KEYS.CURRENT_CONVERSATION);

  // ✅ Return null immediately if nothing is stored
  if (!stored) return null;

  // Safe access with fallbacks
  const settings = stored.settings || {
    isMuted: false,
    isPinned: false,
    isArchived: false,
  };

  return {
    id: stored.id,
    participants: stored.participants || [],
    nickname: stored.nickname,
    lastMessage: stored.lastMessage,
    lastMessageTime: stored.lastMessageTime,
    unreadCount: stored.unreadCount || 0,
    isOnline: stored.isOnline || false,
    settings: {
      isMuted: settings.isMuted ?? false,
      isPinned: settings.isPinned ?? false,
      isArchived: settings.isArchived ?? false,
    },
    createdAt: stored.createdAt || new Date().toISOString(),
    updatedAt: stored.updatedAt || new Date().toISOString(),
  };
};

// ============ Messages Storage ============
export const saveMessagesForConversation = (
  conversationId: string,
  messages: Message[],
): void => {
  const allMessages = loadAllMessages();
  allMessages[conversationId] = messages;
  saveToLocalStorage(STORAGE_KEYS.MESSAGES, {
    data: allMessages,
    lastUpdated: new Date().toISOString(),
  });
};

export const loadMessagesForConversation = (
  conversationId: string,
): Message[] => {
  const allMessages = loadAllMessages();
  return allMessages[conversationId] || [];
};

export const loadAllMessages = (): Record<string, Message[]> => {
  const stored = loadFromLocalStorage(STORAGE_KEYS.MESSAGES);
  return stored?.data || {};
};

export const addMessageToConversation = (
  conversationId: string,
  message: Message,
): void => {
  const currentMessages = loadMessagesForConversation(conversationId);
  const updatedMessages = [...currentMessages, message];
  saveMessagesForConversation(conversationId, updatedMessages);
};

export const updateMessageInConversation = (
  conversationId: string,
  messageId: string,
  updatedMessage: Message,
): void => {
  const currentMessages = loadMessagesForConversation(conversationId);
  const updatedMessages = currentMessages.map((msg) =>
    msg.id === messageId ? updatedMessage : msg,
  );
  saveMessagesForConversation(conversationId, updatedMessages);
};

// ============ Initial App Data ============
export interface InitialAppData {
  user: any;
  friends: StoredFriend[];
  friendRequests: StoredFriendRequest[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
}

export const loadInitialAppData = (): InitialAppData => {
  return {
    user: loadUser(),
    friends: loadFriends(),
    friendRequests: loadFriendRequests(),
    conversations: loadConversations(),
    messages: loadAllMessages(),
  };
};

export const saveInitialAppData = (data: InitialAppData): void => {
  if (data.user) saveUser(data.user);
  if (data.friends) saveFriends(data.friends);
  if (data.friendRequests) saveFriendRequests(data.friendRequests);
  if (data.conversations) saveConversations(data.conversations);
  if (data.messages)
    saveToLocalStorage(STORAGE_KEYS.MESSAGES, {
      data: data.messages,
      lastUpdated: new Date().toISOString(),
    });
};
