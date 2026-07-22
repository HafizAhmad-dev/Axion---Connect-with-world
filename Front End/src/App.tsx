import { Routes, Route, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  logoutUser,
  selectIsAuthenticated,
  setUser,
} from "./Store/Slices/UserSlice";
import { apiFetch } from "./utils/api";
import Layout from "./Layouts/Layout";
import Home from "./Pages/Home";
import RequestsPage from "./Pages/RequestsPage";
import Highlight from "./Pages/Highlights";
import AddHighlightSection from "./Pages/AddHighlightSection";
import AddHighlightLayout from "./Layouts/AddHighlightLayout";
import ChatLayout from "./Pages/ChatWindow";
import Register from "./Pages/Register.page";
import Login from "./Pages/Login.page";
import { loadInitialAppData } from "./services/localStorageService";
import { setConversations } from "./Store/Slices/Conversations.slice";
import { setMessages } from "./Store/Slices/Messages.slice";
import { useSocketListeners } from "./hooks/useSocketListners";
import { useSocketEmitters } from "./services/useSocketEmitters";
import type { RootState } from "./Store/store";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const conversations = useSelector((state:RootState) => state.conversations.conversations);
  const socketEmitter = useSocketEmitters();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


  const loginRoute = "/auth/login";
  const registerRoute = "/auth/register";

  useEffect(() => {
    if(!socketEmitter) return console.log('cant emit socket');
    const conversationIds = conversations.map(convo => convo.id);
    socketEmitter.joinRooms(conversationIds)
  },[conversations])
  // Session restoration on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiFetch("/api/v1/auth/me");
        const data = response.data;
        if (data.success) {
          dispatch(setUser(data.user));
        } else {
          dispatch(logoutUser());
        }
      } catch (error) {
        dispatch(logoutUser());
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [dispatch]);

  // Redirect logic based on authentication status (only after loading)
  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && location.pathname === loginRoute) {
      navigate("/");
    }

    if (
      !isAuthenticated &&
      ![loginRoute, registerRoute].includes(location.pathname)
    ) {
      console.log("User not authenticated, redirecting to login...");
      navigate("/auth/login");
    }
  }, [isAuthenticated, location.pathname, navigate, isLoading]);

  //restore data for offline first application
  useEffect(() => {
    // Load all saved data from localStorage BEFORE app renders
    const savedData = loadInitialAppData();

    if (savedData.user) {
      dispatch(setUser(savedData.user));
    }
    if (savedData.conversations) {
      dispatch(setConversations(savedData.conversations));
    }

    if (savedData.messages) {
      // messages are stored as { conversationId: messages[] }
      Object.entries(savedData.messages).forEach(([convId, msgs]) => {
        dispatch(setMessages({ conversationId: convId, messages: msgs }));
      });
    }
  }, []);

  // Socket listerners
  useSocketListeners()
  


  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/user/highlights" element={<Highlight />} />
        <Route path="/user/requests" element={<RequestsPage />} />
      </Route>

      {/* Nested protected layout */}
      <Route element={<AddHighlightLayout />}>
        <Route path="/user/addHighlights" element={<AddHighlightSection />} />
      </Route>

      {/* Chat */}
      <Route path="/user/chat/:conversationId" element={<ChatLayout />} />

      {/* Auth routes */}
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
    </Routes>
  );
};

export default App;
