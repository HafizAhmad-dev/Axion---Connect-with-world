
import { useDispatch } from "react-redux";
import { logoutUser } from "../Store/Slices/UserSlice";


const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    console.log('calling logoutUser from LogoutBtn.tsx line 11');
    window.location.href = "/auth/login";
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "8px 16px",
        backgroundColor: "#f44336",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;