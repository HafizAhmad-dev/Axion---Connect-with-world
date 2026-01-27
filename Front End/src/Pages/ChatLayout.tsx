import { useSelector } from "react-redux"
import type { RootState } from "../Store/store"
import UnderDev from "../Components/UnderDev"

const ChatLayout = () => {
    const username = useSelector((state:RootState) => state.chatPartner.username)
  return (
    <div className="bg-orange-200 h-screen w-screen">
      Here yOu will be able to communicate with {username}
      <UnderDev />
    </div>
  )
}

export default ChatLayout
