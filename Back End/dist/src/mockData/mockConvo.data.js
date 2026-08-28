"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockConversations = void 0;
exports.mockConversations = [
    {
        id: 'c1',
        participants: ['test_user', 'u1'],
        lastMessage: 'See you later!',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1,
        isGroup: false,
        createdAt: Date.now().toString(),
        updatedAt: Date.now.toString(),
    },
    {
        id: 'c2',
        participants: ['test_user', 'u2'],
        lastMessage: 'Thanks!',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        updatedAt: Date.now.toString(),
        createdAt: Date.now().toString(),
        isGroup: false,
    },
];
