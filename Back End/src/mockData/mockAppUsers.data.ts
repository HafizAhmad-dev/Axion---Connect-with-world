import type { User } from "../types/User.type";

export const mockUsers: User[] = [
  {
    id: "u1",
    email: "alice@example.com",
    username: "alice123",
    displayName: "Alice Johnson",
    password: "$2b$10$fakehash1",
    avatar: "A",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-26T12:00:00Z",
    lastLoginAt: "2024-01-26T12:00:00Z"
  },
  {
    id: "u2",
    email: "bob@example.com",
    username: "bob_dev",
    displayName: "Bob Smith",
    password: "$2b$10$fakehash2",
    avatar: "B",
    createdAt: "2024-01-21T09:30:00Z",
    updatedAt: "2024-01-26T11:45:00Z",
    lastLoginAt: "2024-01-25T18:20:00Z"
  },
  {
    id: "u3",
    email: "charlie@example.com",
    username: "charlieC",
    displayName: "Charlie Brown",
    password: "$2b$10$fakehash3",
    avatar: "C",
    createdAt: "2024-01-22T08:15:00Z",
    updatedAt: "2024-01-26T10:20:00Z",
    lastLoginAt: null
  },
  {
    id: "u4",
    email: "diana@example.com",
    username: "dianaD",
    displayName: "Diana Prince",
    password: "$2b$10$fakehash4",
    avatar: "D",
    createdAt: "2024-01-23T11:10:00Z",
    updatedAt: "2024-01-26T09:50:00Z",
    lastLoginAt: "2024-01-26T09:50:00Z"
  }
];