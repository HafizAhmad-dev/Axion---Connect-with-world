export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type SendFriendRequestResponse =
  | {
      success: true;
      message: string;
      data: FriendRequest;
    }
  | {
      success?: false;
      text: string;
    };

export interface AcceptRequestResult {
  success: boolean;
  friendshipId: string;
  friendId: string;
}

export interface AcceptRequestResponse {
  success: true;
  message: string;
  data: AcceptRequestResult;
}
