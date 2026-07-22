export interface SendMessageReq {
  conversationId: string;
  content: string;
  type?: "text" | "image" | "file";
}