import type { BaseEntity } from "./Base.type.js";

export type MessageStatus = "sent" | "delivered" | "seen";
export type MessageType = "text" | "image" | "file";

export interface Message extends BaseEntity {
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
}
