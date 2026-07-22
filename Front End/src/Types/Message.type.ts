export type MessageStatus = 'sent' | 'delivered' | 'read' | 'sending' | 'pending' | 'failed';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  status: MessageStatus;
}