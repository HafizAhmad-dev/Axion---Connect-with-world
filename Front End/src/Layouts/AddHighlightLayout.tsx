import { X } from "lucide-react"
import { Outlet, useNavigate } from "react-router"

const AddHighlightLayout = () => {
    const navigate = useNavigate();
    function handleClose() {
        navigate(-1);
    }

  return (
    <div className="flex h-screen w-screen flex-col">
        {/* //Header */}
        <header className="flex justify-between px-5 py-5 bg-linear-to-r from-purple-500 to-pink-600">
            <h2 className="text-lg font-bold text-white">Add Highlight</h2>
            <button className="hover:bg-white/20 rounded-full w-7 h-7 flex justify-center items-center"
            onClick={handleClose}>
            
                <X size={15} stroke="white" />
            </button>
        </header>


        {/* Outlet Area */}
        <main className="flex-1"> 
            <Outlet />
        </main>


        {/* Buttons for sharing or aborting the highlight */}
        <div className="flex justify-around items-center px-4 py-4 bg-[#F8FAFC] border-t border-gray-300">
            <button onClick={handleClose} className="px-10 py-2 border border-gray-400 rounded-xl font-semibold text-gray-600 hover:bg-black/2">Cancel</button>
            <button className="px-10 py-2  rounded-xl font-semibold text-white bg-linear-to-r from-purple-500 to-pink-600">Share</button>
        </div>
    </div>
  )
}

export default AddHighlightLayout
