export interface UserType {
  id: string;
  username: string;
  displayName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchUser {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
  status: "friend" | "none" | "pending_sent" | "pending_received";
}

export interface SearchUsersResponse {
  success: true;
  data: SearchUser[];
  message?: string;
}

export interface AuthMeResponse {
  success: boolean;
  user: {
    id: string;
    username: string,
    displayName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  
  };
}