import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../Store/Slices/UserSlice";
import { apiFetch } from "../utils/api";
import RequestBox from "../Components/RequestBox";
import { Inbox, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FriendRequest = {
  id: string;
  username: string;
  displayName?: string;
  joinedAt: Date;
  requestType: "sent" | "received";
  status: "pending" | "rejected" | "accepted";
};

interface ReqObject {
  id: string;
  username: string;
  displayname: string;
  request_type: string;
  created_at: string;
  createdat?: string;
  status?: string;
}

interface RequestsResponse {
  reqs: ReqObject[];
  success: boolean;
}

const RequestsPage = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector(selectUser);

  const fetchRequests = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await apiFetch(`/api/v1/requests/getReqs/`);
      const data: RequestsResponse = await res.data;

      if (data.success && Array.isArray(data.reqs)) {
        const formattedRequests: FriendRequest[] = data.reqs.map((req) => ({
          id: req.id,
          username: req.username,
          displayName: req.displayname,
          joinedAt: new Date(req.created_at || req.createdat || Date.now()),
          requestType: req.request_type as "sent" | "received",
          status: (req.status as "pending" | "rejected" | "accepted") || "pending",
        }));
        setRequests(formattedRequests);
      } else {
        console.error("Failed to fetch requests:", data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh data when tab changes
  useEffect(() => {
    if (user) {
      setRefreshing(true);
      fetchRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const filteredRequests = requests.filter(
    (req) => req.requestType === activeTab
  );
  const getRequestCount = (type: "sent" | "received") => {
    return requests.filter(
      (req) => req.requestType === type && req.status === "pending"
    ).length;
  };

  const buttonVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.02 }
  };

  return (
    <div className="bg-home h-screen flex flex-col pt-4 py-6 px-4">
      {/* Header - fixed at top */}
      <div className="shrink-0 mb-6">
        <h1 className="text-2xl font-bold bg-linear-to-r from-[#2a51ff] to-blue-600 bg-clip-text text-transparent">
          Friend Requests
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage your connections</p>
      </div>

      {/* Tab Buttons - fixed */}
      <div className="shrink-0 flex gap-3 mb-6">
        {/* Received Button */}
        <motion.button
          onClick={() => setActiveTab("received")}
          variants={buttonVariants}
          animate={activeTab === "received" ? "active" : "inactive"}
          transition={{ duration: 0.2 }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
            activeTab === "received"
              ? "bg-linear-to-r from-[#2a51ff] to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <Inbox size={18} />
          <span>Received</span>
          {getRequestCount("received") > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === "received"
                  ? "bg-white/20 text-white"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {getRequestCount("received")}
            </motion.span>
          )}
        </motion.button>

        {/* Sent Button */}
        <motion.button
          onClick={() => setActiveTab("sent")}
          variants={buttonVariants}
          animate={activeTab === "sent" ? "active" : "inactive"}
          transition={{ duration: 0.2 }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
            activeTab === "sent"
              ? "bg-linear-to-r from-[#2a51ff] to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <Send size={18} />
          <span>Sent</span>
          {getRequestCount("sent") > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === "sent"
                  ? "bg-white/20 text-white"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {getRequestCount("sent")}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Loading State */}
        {(loading || refreshing) && filteredRequests.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2a51ff] border-t-transparent"></div>
          </div>
        )}

        {/* Requests List with Animation */}
        <AnimatePresence mode="wait">
          {!loading && !refreshing && filteredRequests.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                {activeTab === "received" ? (
                  <Inbox size={28} className="text-gray-400" />
                ) : (
                  <Send size={28} className="text-gray-400" />
                )}
              </div>
              <p className="text-gray-500">
                {activeTab === "received"
                  ? "No pending friend requests"
                  : "No sent friend requests"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === "received"
                  ? "When someone sends you a request, it will appear here"
                  : "Your sent requests will appear here"}
              </p>
            </motion.div>
          )}

          {!loading && !refreshing && filteredRequests.length > 0 && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {filteredRequests.map((req, index) => (
                <motion.div
                  key={req.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <RequestBox
                    id={req.id}
                    username={req.username}
                    displayName={req.displayName}
                    time={req.joinedAt}
                    type={req.requestType}
                    status={req.status}
                    joinedAt={req.joinedAt}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RequestsPage;