import { Check, X, Clock, UserCheck, Calendar } from "lucide-react";
import PhotoHolder from "./PhotoHolder";
import { useState } from "react";
import { apiFetch } from "../utils/api";

type Props = {
  id: string;
  username: string;
  displayName?: string;
  mutualFriends?: number;
  time: Date;
  type: "sent" | "received";
  joinedAt: string | Date;
  status: "pending" | "accepted" | "rejected";
  onAction?: () => void;
};

const RequestBox = ({ 
  id, 
  username, 
  displayName, 
  mutualFriends, 
  time, 
  type, 
  joinedAt, 
  status,
  onAction 
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
     const response = await apiFetch(`/api/v1/requests/acceptRequest`, {
        method: "PATCH",
        body: JSON.stringify({ requestId: id }),
      });
      console.log(response.data)
      
    } catch (error) {
      console.error("Failed to accept request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await apiFetch(`/api/v1/requests/reject`, {
        method: "POST",
        body: JSON.stringify({ requestId: id }),
      });
      onAction?.();
    } catch (error) {
      console.error("Failed to reject request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await apiFetch(`/api/v1/requests/cancel`, {
        method: "POST",
        body: JSON.stringify({ requestId: id }),
      });
      onAction?.();
    } catch (error) {
      console.error("Failed to cancel request:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const displayNameText = displayName || username;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <PhotoHolder
          css="h-12 w-12 bg-gradient-to-br from-teal-400 to-blue-500 flex-shrink-0"
          username={username}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-gray-800 truncate">
              {displayNameText}
            </h2>
            <span className="text-sm text-gray-500">@{username}</span>
          </div>

          {/* Meta info - Request time */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
            <Clock size={12} />
            <span>{formatRelativeTime(time)}</span>
            {mutualFriends && mutualFriends > 0 && (
              <>
                <span className="mx-1">•</span>
                <span>{mutualFriends} mutual friends</span>
              </>
            )}
          </div>

          {/* Joined date - When user joined the platform */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
            <Calendar size={12} />
            <span>Joined {formatDate(joinedAt)}</span>
          </div>

          {/* Request type indicator */}
          {status === "pending" && (
            <div className="mt-2">
              {type === "received" ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleAccept}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check size={16} />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={16} />
                    <span>Decline</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={16} />
                  <span>Cancel Request</span>
                </button>
              )}
            </div>
          )}

          {/* Accepted status */}
          {status === "accepted" && (
            <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
              <UserCheck size={16} />
              <span>Friends</span>
            </div>
          )}

          {/* Rejected status */}
          {status === "rejected" && (
            <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
              <X size={16} />
              <span>Request declined</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestBox;