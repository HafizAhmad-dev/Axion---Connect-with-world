import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const useInternetConnection = () => {
  const [online, setOnline] = useState(navigator.onLine);
  const   API_URL: string = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const verifyConnection = async () => {
      if (!navigator.onLine) {
        setOnline(false);
        return;
      }

      try {
        await apiFetch(`http://localhost:5000/health`, {
          method: "GET",
          cache: "no-cache",
        });

        setOnline(true);
        console.log("✅ Internet connection is active");
      } catch {
        setOnline(false);
        console.error("❌ Internet connection is inactive");
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
