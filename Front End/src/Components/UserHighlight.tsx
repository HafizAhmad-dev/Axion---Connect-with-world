import { useSelector } from "react-redux";
import PhotoHolder from "../Components/PhotoHolder"
import { Plus } from 'lucide-react';
import type { RootState } from "../Store/store";
import { useNavigate } from "react-router";

const UserHighlight = () => {
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    //fuction to redirect to add highlight section
    function addHighlight() {
        navigate('/user/addhighlights');
    }
    return (
        <div className="flex justify-between items-center px-4 py-6 bg-white rounded-xl shadow-requestscard">
            <div className="flex gap-3">
                <div className="avatar relative">
                    <PhotoHolder css="h-11 w-11" />
                    {user.highlights.length >= 1 ? <HgCount /> : <PlusIcon onClick={addHighlight} />}
                </div>
                <div className="">
                    <h3 className="font-semibold">My Highlight</h3>
                    <p className="text-gray-400 font-semibold text-sm">{user.highlights.length > 0 ? `${user.highlights.length} highlights` : 'Share your moments'}</p>
                </div>
            </div>

            <div className="bg-linear-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-700  w-8 h-8 rounded-full flex justify-center items-center hover:brightness-95 transition-all ease-out cursor-pointer" onClick={addHighlight}>
                <Plus size={20} strokeWidth={2} color="white" />
            </div>
        </div>
    )
}

export default UserHighlight

// Highlight count circle component
const HgCount = () => {
    return (
        <div className='highlightCount absolute h-5 w-5 right-0 bottom-0 rounded-full bg-[#9810FA] border border-gray-300 flex justify-center items-center text-[12px] text-white' >5</div>
    )
}
//plus icon circle component
const PlusIcon = ({onClick}: {onClick: () => void}) => {
    return (
        <div onClick={onClick} className='highlightCount absolute h-5 w-5 -right-1 bottom-0 rounded-full bg-[#9810FA] border border-gray-300 flex justify-center items-center text-[12px] text-white' ><Plus size={12}/></div>
    )
}