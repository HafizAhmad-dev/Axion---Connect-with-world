import PhotoHolder from "../Components/PhotoHolder"
import { Plus } from 'lucide-react';

const UserHighlight = () => {
    return (
        <div className=" flex justify-between px-4 py-6 bg-white rounded-xl shadow-requestscard">
            <div className="flex gap-3">
                <PhotoHolder css="h-11 w-11" />
                <div className="">
                    <h3 className="font-semibold">My Highlight</h3>
                    <p className="text-gray-400 font-semibold text-sm">45 minutes ago</p>
                </div>
            </div>

            <div className="bg-linear-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-700  w-8 h-8 rounded-full flex justify-center items-center">
                <Plus size={20} strokeWidth={2} color="white" />
            </div>
        </div>
    )
}

export default UserHighlight
