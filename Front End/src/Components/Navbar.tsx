import { useEffect, useState } from "react";
import { LuUserPlus } from "react-icons/lu";
import { MessageCircle } from 'lucide-react';
import { Clock4 } from 'lucide-react';
import { useNavigate } from "react-router";
import { useLocation } from 'react-router';


type tabs = 'chats' | 'highlights' | 'requests';

const Navbar = () => {
    const [activeTab, setActiveTab] = useState<tabs>('chats');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const getActiveTab = () => {
            if (location.pathname.includes('highlights')) return 'highlights';
            if (location.pathname.includes('requests')) return 'requests';
            return 'chats'; // default
        };
        setActiveTab(getActiveTab)
    }, [])
    return (
        <nav className=" py-2 bg-white  ">
            {/* list containing all elements */}
            <ul className="flex justify-around">
                {/* //chat tab */}
                <li
                    className={`flex justify-center items-center flex-col  px-4 py-2  rounded-xl ${activeTab === 'chats' ? 'bg-[#F1F6FF]' : ''}`}
                    onClick={() => {
                        setActiveTab('chats');
                        navigate('/');
                    }}
                >
                    <span className="icon">
                        <MessageCircle size={24}
                            strokeWidth={1.5}
                            color={activeTab === 'chats' ? '#4D72FF' : '#6B7280'}
                            fill={activeTab === 'chats' ? '#4D72FF' : 'transparent'} />

                    </span>
                    <span className={`font-hfont font-semibold ${activeTab === 'chats' ? 'text-[#4D72FF]' : 'text-gray-500'}`} >Chats</span>
                </li>

                {/* //moments tab */}
                <li
                    className={`flex justify-center items-center flex-col px-4 py-2  rounded-xl ${activeTab === 'highlights' ? 'bg-[#FBF4FD]' : ''}`}
                    onClick={() => {
                        setActiveTab('highlights');
                        navigate('/highlights');
                    }}
                >
                    <span className="icon">
                        <Clock4 size={24} strokeWidth={1.5} color={activeTab === 'highlights' ? '#9810FA' : '#6B7280'} fill={activeTab === 'highlights' ? '#9810FA' : 'transparent'} />
                    </span>
                    <span className={`font-hfont font-semibold ${activeTab === 'highlights' ? 'text-[#9810FA]' : 'text-gray-500'}`}>HighLights</span>
                </li>



                {/* //requests tab */}
                <li
                    className={`flex justify-center items-center flex-col  px-4 py-2  rounded-xl ${activeTab === 'requests' ? 'bg-[#E0F7F8]' : ''}`}
                    onClick={() => {
                        setActiveTab('requests');
                        navigate('/requests');
                    }}>
                    <span className="icon">
                        <LuUserPlus size={24} strokeWidth={1.5} color={activeTab === 'requests' ? '#4D72FF' : '#6B7280'} fill={activeTab === 'requests' ? '#4D72FF' : 'transparent'} />
                    </span>
                    <span className={`font-hfont font-semibold ${activeTab === 'requests' ? 'text-[#4D72FF]' : 'text-gray-500'}`}>Requests</span>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
