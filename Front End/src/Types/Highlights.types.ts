// types/Highlights.type.ts

export type HighlightType = "text" | "image" | "video";

export interface Highlight {
  id: string;
  type: HighlightType;
  mediaUrl: string | null;
  caption: string | null;
  createdAt: string;
  expiresAt: string;
  viewed: boolean;
  background: string | null;
}

export interface FriendHighlights {
  userId: string;
  username: string;
  displayName: string;
  highlights: Highlight[];
}

export interface GetHighlightsResponse {
  highlights: FriendHighlights[];
}

export interface UserHighlightsResponse {
  highlights: Highlight[];
}

export interface HighlightTextPostData {
  caption: string;
  background: string;
  type: "text";
}