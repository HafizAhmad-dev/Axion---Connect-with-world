 export  type FriendRequestStatus = "sent" | "received" | "accepted" | "rejected" ;
 
 export interface FriendRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: FriendRequestStatus;
  created_at: Date;
  updated_at: Date;
}

