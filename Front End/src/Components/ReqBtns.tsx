import { Check, X } from "lucide-react";
import { useState, type ElementType } from "react";
import { apiFetch } from "../utils/api";
import { Alert } from "flowbite-react";
import axios from "axios";

type Props = {
  variant: "accept" | "decline";
  reqId: string;
  onActionComplete?: (reqId: string) => void;
};

type BtnProperties = {
  label: string;
  icon: ElementType;
  styles: string;
};

interface AcceptFuncitonAPIResponse {
  success: boolean;
  message?: string;
}

const ReqBtns = ({ variant, reqId, onActionComplete }: Props) => {
  const btnProperties: Record<"accept" | "decline", BtnProperties> = {
    accept: {
      label: "Accept",
      icon: Check,
      styles:
        "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 text-white",
    },
    decline: {
      label: "Decline",
      icon: X,
      styles: "bg-gray-300/70 text-black",
    },
  };

  const { label, icon, styles } = btnProperties[variant];
  const IconComponent = icon;

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [progress, setProgress] = useState(0);

  function triggerAlert(message: string) {
    setAlertMsg(message);
    setShowAlert(true);
    setProgress(0);

    const duration = 3000;
    const intervalTime = 30;
    const step = (100 * intervalTime) / duration;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;

        if (next >= 100) {
          clearInterval(interval);
          setShowAlert(false);
          return 0;
        }

        return next;
      });
    }, intervalTime);
  }

  async function handleAction() {
    try {
      if (variant === "accept") {
        const res = await apiFetch(`/api/v1/requests/acceptRequest/`, {
          method: "PATCH",
          body: JSON.stringify({ reqId }),
        });

        const data: AcceptFuncitonAPIResponse = await res.data;

        if (data.success) {
          triggerAlert(data.message || "Request accepted");
          onActionComplete?.(reqId);
        } else {
          triggerAlert(data.message || "Failed to accept request");
        }
      }

      if (variant === "decline") {
        const res = await apiFetch(`/api/v1/requests/declineRequest`, {
          method: "PATCH",
          body: JSON.stringify({ reqId }),
        });

        const data: AcceptFuncitonAPIResponse = await res.data;

        if (data.success) {
          triggerAlert(data.message || "Request declined");
          onActionComplete?.(reqId);
        } else {
          triggerAlert(data.message || "Failed to decline request");
        }
      }
    } catch (err) {
      if(axios.isAxiosError(err)) {
        triggerAlert(err.response?.data?.message || "An error occurred");
      } else {
        triggerAlert("An unexpected error occurred");
      }
    }
  }

  return (
    <>
      <button
        className={`px-8 py-2 flex items-center gap-1 font-hfont rounded-xl ${styles}`}
        onClick={handleAction}
      >
        <IconComponent size={16} />
        {label}
      </button>

      {showAlert && (
        <Alert
          className="absolute top-22 right-10 overflow-hidden p-0 w-72"
          color="success"
          onDismiss={() => setShowAlert(false)}
        >
          {/* TOP PROGRESS BAR */}
          <div
            className="h-1 bg-green-600 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />

          <div className="p-3">
            <span className="font-medium">{alertMsg}</span>
          </div>
        </Alert>
      )}
    </>
  );
};

export default ReqBtns;