import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const useInternetConnection = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const verifyConnection = async () => {
      if (!navigator.onLine) {
        setOnline(false);
        return;
      }

      try {
        await apiFetch(`${apiUrl}/health`, {
          method: "GET",
          cache: "no-cache",
        });

        setOnline(true);
        // console.log("✅ Backend connection is active");
      } catch {
        setOnline(false);
        console.error("❌ Backend connection is inactive");
      }
    };

    window.addEventListener("online", verifyConnection);
    window.addEventListener("offline", verifyConnection);

    verifyConnection();

    return () => {
      window.removeEventListener("online", verifyConnection);
      window.removeEventListener("offline", verifyConnection);
    };
  }, []);

  return { online };
};

export default useInternetConnection;