"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findExistingRequest = exports.findFriendRequest = exports.removeFriendRequest = exports.getFriendRequests = exports.getRequests = exports.addRequest = exports.friendRequests = void 0;
;
exports.friendRequests = [
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
const addRequest = (req) => {
    exports.friendRequests.push(req);
};
exports.addRequest = addRequest;
const getRequests = () => exports.friendRequests;
exports.getRequests = getRequests;
const getFriendRequests = (userId) => {
    return exports.friendRequests.filter((r) => r.to === userId);
};
exports.getFriendRequests = getFriendRequests;
const removeFriendRequest = (reqId) => {
    const index = exports.friendRequests.findIndex((r) => r.id === reqId);
    if (index !== -1) {
        exports.friendRequests.splice(index, 1);
    }
};
exports.removeFriendRequest = removeFriendRequest;
const findFriendRequest = (reqId) => {
    return exports.friendRequests.find((r) => r.id === reqId);
};
exports.findFriendRequest = findFriendRequest;
const findExistingRequest = (from, to) => {
    return exports.friendRequests.find((r) => (r.from === from && r.to === to) ||
        (r.from === to && r.to === from));
};
exports.findExistingRequest = findExistingRequest;
