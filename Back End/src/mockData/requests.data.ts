export interface FriendRequestInterface {
  createdAt: Date;
  id: string;
  from: string;
  to: string;
  status: "pending" | "accepted" | "rejected";
};

export let friendRequests = [
  { id: "r1", from: "u1", to: "u2", status: "pending", createdAt: new Date() },
  { id: "r2", from: "u3", to: "u1", status: "pending", createdAt: new Date() },
  { id: "r3", from: "u1", to: "u4", status: "accepted", createdAt: new Date() },
  {
    id: "r4",
    from: "9437ed09-e2e4-4e0c-b3bb-ddffdac24fa8",
    to: "u1",
    status: "accepted",
    createdAt: new Date()
  }
];

export const addRequest = (req:FriendRequestInterface) => {
  friendRequests.push(req);
};

export const getRequests = () => friendRequests;

export const getFriendRequests = (userId: string) => {
  return friendRequests.filter((r) => r.to === userId);
};

export const removeFriendRequest = (reqId: string) => {
  const index = friendRequests.findIndex((r) => r.id === reqId);

  if (index !== -1) {
    friendRequests.splice(index, 1);
  }
};

export const findFriendRequest = (reqId: string) => {
  return friendRequests.find((r) => r.id === reqId);
};

export const findExistingRequest = (from: string, to: string) => {
  return friendRequests.find(
    (r) =>
      (r.from === from && r.to === to) ||
      (r.from === to && r.to === from)
  );
};