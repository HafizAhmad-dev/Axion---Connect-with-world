import { useMemo } from "react";

function useInitials(username:string) {
  return useMemo(() => {
    if (!username) return "";

    return username
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0])
      .join("");
  }, [username]);
}

export default useInitials;
