import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const useInternetConnection = () => {
  const [online, setOnline] = useState(navigator.onLine);
  // const apiVersion: string = import.meta.env.VITE_API_VERSION;

  useEffect(() => {
    const verifyConnection = async () => {
      if (!navigator.onLine) {
        setOnline(false);
        return;
      }

      try {
        await apiFetch(`/health`, {
          method: "HEAD",
          cache: "no-cache",
        });

        setOnline(true);
      } catch {
        setOnline(false);
      }
    };

    window.addEventListener("online", verifyConnection);
    window.addEventListener("offline", verifyConnection);

    verifyConnection(); // initial check

    return () => {
      window.removeEventListener("online", verifyConnection);
      window.removeEventListener("offline", verifyConnection);
    };
  }, []);

  return { online };
};
export default useInternetConnection;
