// Components/AnimatedSearchPanel.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import SearchUser from "./SearchUser.input";
import UsersList from "../Components/UsersList";

type AnimatedSearchPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (value: string) => void;
};

const AnimatedSearchPanel = ({ 
  isOpen, 
  onClose, 
  query, 
  setQuery 
}: AnimatedSearchPanelProps) => {
  const [localQuery, setLocalQuery] = useState(query);

  // Sync with parent query when panel closes
  useEffect(() => {
    if (!isOpen) {
      setLocalQuery("");
      setQuery("");
    }
  }, [isOpen, setQuery]);

  // Update parent query when typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden fixed inset-x-0 top-0 z-50 bg-white shadow-lg rounded-b-2xl"
          style={{ maxHeight: "100vh" }}
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="p-4 pb-6"
          >
            {/* Header with close button */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="flex-1">
                <SearchUser 
                  query={localQuery} 
                  setQuery={setLocalQuery}
                  autoFocus={true}
                />
              </div>
            </div>

            {/* Search Results */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 120px)" }}
            >
              <UsersList query={localQuery} setQuery={setLocalQuery} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSearchPanel;