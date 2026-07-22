// Components/UsersList.tsx
import { useEffect, useState, useCallback } from "react";
import { UserPlus, CheckCircle, UserCheck, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import PhotoHolder from "./PhotoHolder";
import axios from "axios";
import { selectUser } from "../Store/Slices/UserSlice";
import { setCurrentConversation } from "../Store/Slices/CurrentConversation";
import { apiFetch } from "../utils/api";

// ✅ Updated User type to match backend status values
type User = {
  id: string;
  username: string;
  displayName?: string;
  avatar: string;
  createdAt: Date | string;
  status: "none" | "friend" | "pending_sent" | "pending_received";
};

type ApiResponse = {
  success: boolean;
  data: User[];
  message?: string;
};

type UsersListProps = {
  query: string;
  setQuery: (value: string) => void;
};

const API_VERSION = import.meta.env.VITE_API_VERSION;

const UsersList = ({ query }: UsersListProps) => {
  const currentUser = useSelector(selectUser);

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ===================== FORMAT DATE FUNCTIONS =========================
  const formatRelativeDate = useCallback(
    (createdAt?: Date | string | null): string => {
      if (!createdAt) return "Recently";

      try {
        const date =
          typeof createdAt === "string" ? new Date(createdAt) : createdAt;
        if (isNaN(date.getTime())) return "Unknown date";

        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365)
          return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
        return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
      } catch {
        return "Recently";
      }
    },
    [],
  );

  // ===================== FETCHING THE USERS =========================
  async function fetchUsers(signal?: AbortSignal) {
    if (!currentUser || !query.trim()) {
      setUsers([]);
      return;
    }

    setLoadingUsers(true);
    setUsersError(null);

    try {
      const res = await apiFetch(
        `/${API_VERSION}/users/search?q=${encodeURIComponent(query)}`,
        { signal },
      );
      const data: ApiResponse = res.data;

      if (data.success) {
        setUsers(data.data);
      } else {
        setUsers([]);
        setUsersError(data.message || "No users found");
      }
    } catch (error) {
      // Don't set error if request was aborted
      if (
        axios.isCancel(error) ||
        (error instanceof Error && error.name === "AbortError")
      ) {
        console.log("Request aborted");
        return;
      }

      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        setUsersError(error.response?.data?.message || "Failed to fetch users");
      } else {
        console.error("Unexpected error:", error);
        setUsersError("An unexpected error occurred");
      }
    } finally {
      setLoadingUsers(false);
    }
  }

  // ===================== SEND FRIEND REQUEST =========================
  async function sendRequest(toId: string) {
    if (!currentUser) return;

    // Optimistic update: change status to 'pending_sent' immediately
    const previousUsers = [...users];
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === toId ? { ...user, status: "pending_sent" as const } : user,
      ),
    );

    try {
      const res = await apiFetch(`/${API_VERSION}/requests/send`, {
        method: "POST",
        body: JSON.stringify({
          from: currentUser.id,
          to: toId,
        }),
      });

      if (!res.data.success) {
        // Revert on failure
        setUsers(previousUsers);
        console.error("Failed to send request:", res.data.message);
      }
    } catch (error) {
      // Revert on error
      setUsers(previousUsers);
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  // ===================== ACCEPT FRIEND REQUEST =========================
  async function acceptRequest(userId: string) {
    if (!currentUser) return;

    // Optimistic update: change status to 'friend' immediately
    const previousUsers = [...users];
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: "friend" as const } : user,
      ),
    );

    try {
      const res = await apiFetch(`/${API_VERSION}/requests/accept`, {
        method: "POST",
        body: JSON.stringify({
          userId: currentUser.id,
          friendId: userId,
        }),
      });

      if (!res.data.success) {
        // Revert on failure
        setUsers(previousUsers);
        console.error("Failed to accept request:", res.data.message);
      }
    } catch (error) {
      // Revert on error
      setUsers(previousUsers);
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  // ===================== EFFECTS =========================
  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setUsersError(null);
      return;
    }

    const abortController = new AbortController();

    const timer = setTimeout(() => {
      fetchUsers(abortController.signal);
    }, 400);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query, currentUser]);

  // ====================== OPENING THE CONVERSATION ================================
  const openConversation = async (user: User) => {
    try {
      // Get or create conversation with this user
      const response = await apiFetch(
        `/${API_VERSION}/conversations/with/${user.id}`,
      );
      const { conversation } = response.data;

      // Store in Redux
      dispatch(setCurrentConversation(conversation));

      // Navigate to chat page
      navigate(`/user/chat/${conversation.id}`);
    } catch (error) {
      console.error("Failed to open conversation:", error);
    }
  };
  // ===================== LOADING SKELETON =========================
  const LoadingSkeleton = () => (
    <div className="space-y-2 mt-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse flex gap-3 items-center p-2">
          <div className="h-11 w-11 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
        </div>
      ))}
    </div>
  );

  // ===================== RENDER =========================
  return (
    <div className="flex flex-col max-h-full">
      {/* Users Section */}
      {users.length > 0 && (
        <h1 className="font-bold text-lg ml-3 mt-5">Users</h1>
      )}

      {/* Loading State for Users - Skeleton */}
      {loadingUsers && <LoadingSkeleton />}

      {/* Users Error */}
      {usersError && <p className="text-red-500 mt-2 ml-3">{usersError}</p>}

      {/* Users List */}
      {users.length > 0 ? (
        <div className="mt-2 space-y-2">
          {users.map((user, index) => (
            <div
              key={user.id}
              onClick={() => {
                if(user.status === 'friend'){
                  openConversation(user);
                }
              }}
              className={`flex gap-3 items-center p-2 rounded-md hover:bg-gray-50 ${
                index === 0 ? "" : "mt-2"
              }`}
            >
              <PhotoHolder username={user.username} />
              <div className="flex-1">
                <div className="font-semibold">
                  {user.displayName || user.username}
                </div>
                <div className="text-sm text-gray-500">
                  Joined {formatRelativeDate(user.createdAt)}
                </div>
              </div>

              {/* Status: Friend */}
              {user.status === "friend" && (
                <div className="ml-auto flex items-center gap-1 text-green-500 text-sm">
                  <CheckCircle size={14} />
                  <span>Friend</span>
                </div>
              )}

              {/* Status: No relationship - Show Send Request button */}
              {user.status === "none" && (
                <button
                  className="ml-auto border border-gray-300 px-4 py-1.5 rounded-xl hover:bg-gray-100 transition-all text-sm flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    sendRequest(user.id);
                  }}
                >
                  <UserPlus size={14} />
                  Send Request
                </button>
              )}

              {/* Status: Request sent by current user - Show pending */}
              {user.status === "pending_sent" && (
                <div className="ml-auto flex items-center gap-1 text-yellow-500 text-sm">
                  <Clock size={14} />
                  <span>Request Sent</span>
                </div>
              )}

              {/* Status: Request received from this user - Show Accept button */}
              {user.status === "pending_received" && (
                <button
                  className="ml-auto bg-blue-500 text-white px-4 py-1.5 rounded-xl hover:bg-blue-600 transition-all text-sm flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    acceptRequest(user.id);
                  }}
                >
                  <UserCheck size={14} />
                  Accept Request
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loadingUsers &&
        query.trim() &&
        !usersError && <p className="text-gray-500 mt-2 ml-3">No users found</p>
      )}
    </div>
  );
};

export default UsersList;
