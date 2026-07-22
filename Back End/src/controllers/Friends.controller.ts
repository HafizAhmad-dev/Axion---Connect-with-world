import { Request, Response } from "express";
import {
  friendsRelationData,
  friendsRelationDataType,
} from "../mockData/FriendsRelation.data";
import { mockUsers } from "../mockData/mockAppUsers.data";

interface friendPreveiewDataType {
  username: string;
  displayName: string;
  id: string;
  friendsSince: friendsRelationDataType["friendsSince"];
}

export const getFriends = (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const query = (req.query.q as string) || "";

    if (!userId) {
      return res.status(400).json({ success: false, message: "no userId provided" });
    }
    
    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "no search query provided" });
    }

    const userMap = new Map(mockUsers.map((u) => [u.id, u]));

    // Get all friend relationships for the user
    const friendsData = friendsRelationData.filter(
      (friend) => friend.userA === userId || friend.userB === userId,
    );

    // Process friends - filter out any that don't exist or don't match search
    const friends: friendPreveiewDataType[] = [];

    for (const friendRelation of friendsData) {
      const friendId = friendRelation.userA === userId 
        ? friendRelation.userB 
        : friendRelation.userA;
      
      const user = userMap.get(friendId);
      
      // Skip if user doesn't exist
      if (!user) {
        console.warn(`User ${friendId} not found in mockUsers`);
        continue;
      }
      
      // Check if user matches search query
      const matchesSearch = 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.displayName.toLowerCase().includes(query.toLowerCase());
      
      if (!matchesSearch) continue;
      
      // Add valid friend to results
      friends.push({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        friendsSince: friendRelation.friendsSince,
      });
    }

    // Log for debugging
    console.log(`Found ${friends.length} friends matching "${query}"`);

    res.json({
      success: true,
      data: friends,
    });
  } catch (error) {
    console.error("Error in getFriends:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
