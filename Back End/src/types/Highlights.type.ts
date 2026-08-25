export interface Highlight {
  id: string;
  userId: string;
  type: "text" | "image" | "video";
  mediaUrl: string | null;
  caption: string | null;
  createdAt: string;
  expiresAt: string;
}

export interface HighlightInput {
  type: "text" | "image" | "video";
  mediaUrl?: string | null;
  background?: string;
  caption?: string | null;
}

export interface HighlightRow  {
  friend_id: string;
  username: string;
  displayname: string;
  highlight_id: string;
  type: "text" | "image" | "video";
  media_url: string | null;
  background: string;
  caption: string | null;
  created_at: string;
  expires_at: string;
  viewed: boolean;
};

export type HighlightType = "text" | "image" | "video";

export interface HighlightResponse {
  id: string;
  type: HighlightType;
  mediaUrl: string | null;
  caption: string | null;
  createdAt: string;
  expiresAt: string;
  background:string;
  viewed: boolean;
}

export interface FriendHighlightsResponse {
  userId: string;
  username: string;
  displayName: string;
  highlights: HighlightResponse[];
}

export interface GetHighlightsResponse {
  highlights: FriendHighlightsResponse[];
}