import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, AlertCircle } from "lucide-react";

import { clearError } from "../Store/Slices/Errors.slice";
import type { RootState } from "../Store/store";

const ErrorNotification = () => {
  const dispatch = useDispatch();

  const notification = useSelector(
    (state: RootState) => state.error
  );

  useEffect(() => {
    if (!notification.message) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(clearError());
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [notification.message, dispatch]);

  if (!notification.message) {
    return null;
  }

  return (
    <div className="errornotification fixed top-5 right-5 z-50 w-80 overflow-hidden rounded-lg shadow-lg">
      <div className="flex items-start gap-3 bg-red-500 px-4 py-3 text-white">
        <AlertCircle size={20} className="mt-0.5 shrink-0" />

        <div className="flex-1">
          <p className="font-medium">
            {notification.message}
          </p>
        </div>

        <button
          onClick={() => dispatch(clearError())}
          aria-label="Close notification"
          className="shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-red-300">
     <div className="notification-progress h-full w-full bg-red-900" />   
      </div>
    </div>
  );
};

export default ErrorNotification;