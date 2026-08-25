// types/Highlights.type.ts

export type HighlightType = "text" | "image" | "video";

export interface Highlight {
  id: string;
  type: HighlightType;
  mediaUrl: string | null;
  caption: string | null;
  createdAt: string;
  background:string;
  expiresAt: string;
  viewed: boolean;
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
export interface userHighlightsResponse {
  highlights: Highlight[];
}
export interface highlightTextPostData {
  caption: string,
  background:string,
  type:'text'
}