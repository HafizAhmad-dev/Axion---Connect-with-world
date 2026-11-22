import { useSelector } from "react-redux";
import type { RootState } from "../Store/store";

export default function useProfileData() {
    const profileData = useSelector((state: RootState) => state.user.user);
   
    return {
        profileData,
    };
}