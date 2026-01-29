export interface Conversation {
    id: string
    participants: string[]        // user IDs
    lastMessage?: string
    unreadCount: number
    lastMessageTime: string
    settings:Settings
    createdAt?: string
    updatedAt?: string
}

export interface Settings {
  isMuted: boolean
        isPinned?: boolean
        isArchived?: boolean
}