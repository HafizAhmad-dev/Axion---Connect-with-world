import type { Request, Response } from "express";
import type { FriendHighlightsResponse, HighlightInput } from "../types/Highlights.type";
import { createHighlightModel, getActiveHighlightModel, getUserActiveHighlightsModel, highlightViewedModel, retreiveHighlightsModel } from "../../database/models/highlights.model";
import type { HighlightRow } from "../types/Highlights.type";

// Controller function to create a highlight
export const createHighlight = async (req: Request, res: Response) => {
  //controller inputs
  const userId = req.user?.id;
  const highlightData: HighlightInput = req.body;

  //check the inputs
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!highlightData) {
    return res.status(400).json({
      error: "Request body is required",
    });
  }

  if (!highlightData.type) {
    return res.status(400).json({ error: "Error: Highlight type is required" });
  }

  if (
    highlightData.type !== "text" &&
    highlightData.type !== "image" &&
    highlightData.type !== "video"
  ) {
    return res.status(400).json({ error: "Error: Invalid highlight type" });
  }

  // validate caption for text highlights
  if (
    highlightData.type === "text" &&
    (!highlightData.caption || highlightData.caption.trim() === "")
  ) {
    return res
      .status(400)
      .json({ error: "Error: Caption is required for text highlights" });
  }

  try {
    const newHighlight = await createHighlightModel(userId, highlightData);
    res.status(201).json(newHighlight);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Function for handling the views;
export const viewHighlight = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;
  const { highlightId } = req.params as { highlightId: string };

  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  if (!highlightId) {
    return res.status(400).json({
      error: "Highlight ID is required",
    });
  }

  try {
   
    const highlight = await getActiveHighlightModel(highlightId);

    if (!highlight) {
      return res.status(404).json({
        error: "Highlight not found or has expired",
      });
    }


    const view = await highlightViewedModel(
      highlightId,
      userId
    );

    if (!view) {
      return res.status(200).json({
        message: "Highlight already viewed",
      });
    }

    // First view
    return res.status(201).json({
      message: "Highlight viewed",
      view,
    });

  } catch (error) {
    console.error("Error viewing highlight:", error);

    return res.status(500).json({
      error: "Failed to record highlight view",
    });
  }
};




// Retrieve active Highlights of user's friends
export const retrieveHighlights = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;

  // Check authentication
  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const highlights = await retreiveHighlightsModel(userId);
    
    const formattedHighlights: FriendHighlightsResponse[] = formatHighlights(highlights);
    return res.status(200).json({
      highlights: formattedHighlights,
    });

  } catch (error) {
    console.error("Error retrieving highlights:", error);

    return res.status(500).json({
      error: "Failed to retrieve highlights",
    });
  }
};

function formatHighlights(rows: HighlightRow[]) {
  const friends = new Map<string, FriendHighlightsResponse>();

  for(const row of rows){
    if(!friends.has(row.friend_id)){
      friends.set(row.friend_id, {
        userId: row.friend_id,
        username: row.username,
        displayName: row.displayname,
        highlights: [],
       
      });
    }

    const friend = friends.get(row.friend_id);
    if(friend){
      friend.highlights.push({
        id: row.highlight_id,
        type: row.type,
        mediaUrl: row.media_url,
        caption: row.caption,
        createdAt: row.created_at,
        expiresAt: row.expires_at,
        viewed: row.viewed,
        background:row?.background
      });
    }
  }
  return Array.from(friends.values());
};

//retrive the user highlights
export const retrieveUserHighlights = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;

  // Authentication check
  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const highlights = await getUserActiveHighlightsModel(userId);

    return res.status(200).json({
      highlights,
    });
  } catch (error) {
    console.error("Error retrieving my highlights:", error);

    return res.status(500).json({
      error: "Failed to retrieve highlights",
    });
  }
};