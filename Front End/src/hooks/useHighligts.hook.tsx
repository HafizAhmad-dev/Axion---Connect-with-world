
import { useDispatch, useSelector } from "react-redux";
import {  type RootState } from "../Store/store";
import { useEffect } from "react";
import { apiFetch } from "../utils/api";
import type { GetHighlightsResponse, userHighlightsResponse } from "../Types/Highlights.types";
import { setFriendsHighlights, setUserHighligths } from "../Store/Slices/Highlights.slice";
import type { Highlight } from "../Types/Highlights.types";
const apiUrl = import.meta.env.VITE_API_URL;

export const useHighlights = () => {
  const friendsHighlights = useSelector(
    (state: RootState) => state.highlights.friendsHighlights,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Highlights",friendsHighlights);
  }, [friendsHighlights]);

  useEffect(() => {
    async function fetchHighlights() {
      try {
        const response = await apiFetch<GetHighlightsResponse>(
          `${apiUrl}/highlights`,
        );
        dispatch(setFriendsHighlights(response.data.highlights))
        console.log(response.data.highlights)
      } catch (error) {
        console.log(error);
      }
    }
    fetchHighlights();
  }, []);

  /// FETCH THE USER HIGHLIGHTS 
  useEffect(() => {

     async function fetchHighlights() {
      try {
        const response = await apiFetch<userHighlightsResponse>(
          `${apiUrl}/highlights/me`,
        );
        dispatch(setUserHighligths(response.data.highlights))
      } catch (error) {
        console.log(error);
      }
    }

    fetchHighlights();

  },[])
  return friendsHighlights;
};

