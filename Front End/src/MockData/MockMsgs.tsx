import type { Message } from "../Types/Message.type";

export const mockMessages: Record<string, Message[]> = {
    c1: [
        { id: "m1", conversationId: "c1", senderId: "u1", textContent: "Hey! Are you free?", timestamp: "2024-01-29T09:50:00Z", status: "Seen" },
        { id: "m2", conversationId: "c1", senderId: "me", textContent: "Yes, just finished work.", timestamp: "2024-01-29T09:52:00Z", status: "Seen" },
        { id: "m3", conversationId: "c1", senderId: "u1", textContent: "Great! See you later!", timestamp: "2024-01-29T10:00:00Z", status: "Delivered" },
    ],
    c2: [
        { id: "m4", conversationId: "c2", senderId: "u2", textContent: "Did you get the document?", timestamp: "2024-01-28T20:00:00Z", status: "Delivered" },
        { id: "m5", conversationId: "c2", senderId: "me", textContent: "Yes, thanks!", timestamp: "2024-01-28T20:30:00Z", status: "Sent" },
    ],
    c3: [
        { id: "m6", conversationId: "c3", senderId: "u3", textContent: "Can you review this?", timestamp: "2024-01-28T18:50:00Z", status: "Seen" },
        { id: "m7", conversationId: "c3", senderId: "me", textContent: "Got it, will check soon.", timestamp: "2024-01-28T19:00:00Z", status: "Delivered" },
        { id: "m8", conversationId: "c3", senderId: "u3", textContent: "Thanks!", timestamp: "2024-01-28T19:15:00Z", status: "Delivered" },
    ],
};