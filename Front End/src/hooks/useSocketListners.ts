import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "./useSocket";
import { selectUser } from "../Store/Slices/UserSlice";
import { setupSocketListners } from "../services/socketListenersService";
import { useEffect } from "react";

export const useSocketListeners = () => {
  const user = useSelector(selectUser);
  const { socket, isConnected } = useSocket();

  const dispatch = useDispatch();

  useEffect(() => {
    if (socket === null || !isConnected || user === null) {
    
      return;
    }

    const cleanup = setupSocketListners(dispatch, socket);

    return cleanup;
  }, [socket, isConnected, user, dispatch]);
};
