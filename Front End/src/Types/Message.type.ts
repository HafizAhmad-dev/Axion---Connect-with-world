export interface Message {
    id: string;             // unique ID for this message
    conversationId: string; // references the conversation/contact (like "c1")
    senderId: string;       // sender, can be "me" or contact ID
    timestamp: string;
    status: Status;
    textContent: string;
}

type Status = "Waiting to Send" | 'Delivered' | 'Sent' | 'Seen';