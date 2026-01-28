import type { Message } from "../Types/Message.type";

export const mockMessages: Record<string, Message[]> = {
  c1: [
    { id: "m1", conversationId: "c1", senderId: "User1", textContent: "Hey, are we still on for today?", timestamp: "2024-01-26T09:20:00Z", status: "Seen" },
    { id: "m2", conversationId: "c1", senderId: "me", textContent: "Yes, see you at the meeting!", timestamp: "2024-01-26T09:21:00Z", status: "Seen" },
    { id: "m3", conversationId: "c1", senderId: "User1", textContent: "Great! Did you prepare the slides?", timestamp: "2024-01-26T09:22:00Z", status: "Seen" },
    { id: "m4", conversationId: "c1", senderId: "me", textContent: "Almost done, finishing them now.", timestamp: "2024-01-26T09:23:00Z", status: "Seen" },
    { id: "m5", conversationId: "c1", senderId: "User1", textContent: "Perfect, thanks!", timestamp: "2024-01-26T09:25:00Z", status: "Seen" },
  ],

  c2: [
    { id: "m6", conversationId: "c2", senderId: "Another User", textContent: "I’ve reviewed the document.", timestamp: "2024-01-26T08:00:00Z", status: "Seen" },
    { id: "m7", conversationId: "c2", senderId: "me", textContent: "Thanks for the update 👍", timestamp: "2024-01-26T08:05:00Z", status: "Seen" },
    { id: "m8", conversationId: "c2", senderId: "Another User", textContent: "No problem, I added a few comments.", timestamp: "2024-01-26T08:10:00Z", status: "Seen" },
    { id: "m9", conversationId: "c2", senderId: "me", textContent: "Got it, I’ll make the changes.", timestamp: "2024-01-26T08:15:00Z", status: "Seen" },
    { id: "m10", conversationId: "c2", senderId: "Another User", textContent: "Looks good now.", timestamp: "2024-01-26T08:20:00Z", status: "Seen" },
  ],

  c3: [
    { id: "m11", conversationId: "c3", senderId: "Sarah Chen", textContent: "Can we reschedule?", timestamp: "2024-01-26T07:00:00Z", status: "Delivered" },
    { id: "m12", conversationId: "c3", senderId: "me", textContent: "Sure, what time works for you?", timestamp: "2024-01-26T07:02:00Z", status: "Sent" },
    { id: "m13", conversationId: "c3", senderId: "Sarah Chen", textContent: "How about 3 PM?", timestamp: "2024-01-26T07:05:00Z", status: "Delivered" },
    { id: "m14", conversationId: "c3", senderId: "me", textContent: "3 PM works for me.", timestamp: "2024-01-26T07:10:00Z", status: "Sent" },
    { id: "m15", conversationId: "c3", senderId: "Sarah Chen", textContent: "Perfect, see you then.", timestamp: "2024-01-26T07:15:00Z", status: "Delivered" },
  ],

  c4: [
    { id: "m16", conversationId: "c4", senderId: "Marcus Rodriguez", textContent: "Everything looks good from my side.", timestamp: "2024-01-26T06:00:00Z", status: "Seen" },
    { id: "m17", conversationId: "c4", senderId: "me", textContent: "Perfect! I'll send it over.", timestamp: "2024-01-26T06:02:00Z", status: "Seen" },
    { id: "m18", conversationId: "c4", senderId: "Marcus Rodriguez", textContent: "Thanks, looking forward to it.", timestamp: "2024-01-26T06:05:00Z", status: "Seen" },
    { id: "m19", conversationId: "c4", senderId: "me", textContent: "Sent the files.", timestamp: "2024-01-26T06:10:00Z", status: "Seen" },
    { id: "m20", conversationId: "c4", senderId: "Marcus Rodriguez", textContent: "Got it, thanks.", timestamp: "2024-01-26T06:15:00Z", status: "Seen" },
  ],

  c5: [
    { id: "m21", conversationId: "c5", senderId: "Emily Watson", textContent: "Great work on the presentation", timestamp: "2024-01-25T17:00:00Z", status: "Seen" },
    { id: "m22", conversationId: "c5", senderId: "me", textContent: "Thanks, Emily!", timestamp: "2024-01-25T17:05:00Z", status: "Seen" },
    { id: "m23", conversationId: "c5", senderId: "Emily Watson", textContent: "Your section was very clear.", timestamp: "2024-01-25T17:10:00Z", status: "Seen" },
    { id: "m24", conversationId: "c5", senderId: "me", textContent: "Appreciate it!", timestamp: "2024-01-25T17:15:00Z", status: "Seen" },
  ],

  c6: [
    { id: "m25", conversationId: "c6", senderId: "me", textContent: "Any update on this?", timestamp: "2024-01-25T16:00:00Z", status: "Seen" },
    { id: "m26", conversationId: "c6", senderId: "David Kim", textContent: "Let me check and get back to you", timestamp: "2024-01-25T16:05:00Z", status: "Seen" },
    { id: "m27", conversationId: "c6", senderId: "David Kim", textContent: "Checked, all good now.", timestamp: "2024-01-25T16:10:00Z", status: "Delivered" },
    { id: "m28", conversationId: "c6", senderId: "me", textContent: "Great, thanks!", timestamp: "2024-01-25T16:12:00Z", status: "Sent" },
  ],

  c7: [
    { id: "m29", conversationId: "c7", senderId: "Lisa Anderson", textContent: "Are you free later?", timestamp: "2024-01-24T13:00:00Z", status: "Seen" },
    { id: "m30", conversationId: "c7", senderId: "me", textContent: "Sure thing!", timestamp: "2024-01-24T13:05:00Z", status: "Seen" },
    { id: "m31", conversationId: "c7", senderId: "Lisa Anderson", textContent: "Perfect, let's meet at 5.", timestamp: "2024-01-24T13:10:00Z", status: "Delivered" },
    { id: "m32", conversationId: "c7", senderId: "me", textContent: "See you then.", timestamp: "2024-01-24T13:15:00Z", status: "Sent" },
  ],

  c8: [
    { id: "m33", conversationId: "c8", senderId: "James Taylor", textContent: "Let me know when you arrive.", timestamp: "2024-01-23T10:00:00Z", status: "Delivered" },
    { id: "m34", conversationId: "c8", senderId: "me", textContent: "Looking forward to it", timestamp: "2024-01-23T10:05:00Z", status: "Sent" },
    { id: "m35", conversationId: "c8", senderId: "James Taylor", textContent: "Traffic is bad, might be late.", timestamp: "2024-01-23T10:15:00Z", status: "Delivered" },
    { id: "m36", conversationId: "c8", senderId: "me", textContent: "No worries, take your time.", timestamp: "2024-01-23T10:20:00Z", status: "Sent" },
    { id: "m37", conversationId: "c8", senderId: "James Taylor", textContent: "Thanks!", timestamp: "2024-01-23T10:25:00Z", status: "Seen" },
  ],
};
