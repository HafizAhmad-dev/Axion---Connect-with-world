import { useState } from "react";
import { LuUserPlus } from "react-icons/lu";
import { MessageCircle } from 'lucide-react';
import { Clock4 } from 'lucide-react';

type tabs = 'chats' | 'moments' | 'requests';

const Navbar = () => {
    const [activeTab, setActiveTab] = useState<tabs>('chats');
    return (
        <nav className=" py-2 bg-white  ">
            {/* list containing all elements */}
            <ul className="flex justify-around">
                {/* //chat tab */}
                <li className={`flex justify-center items-center flex-col  px-4 py-2  rounded-xl ${activeTab === 'chats' ? 'bg-[#F1F6FF]' : ''}`} onClick={() => setActiveTab('chats')}>
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
                    className={`flex justify-center items-center flex-col px-4 py-2  rounded-xl ${activeTab === 'moments' ? 'bg-[#FBF4FD]' : ''}`}
                    onClick={() => setActiveTab('moments')}
                >
                    <span className="icon">
                        <Clock4 size={24} strokeWidth={1.5} color={activeTab === 'moments' ? '#9810FA' : '#6B7280'} fill={activeTab === 'moments' ? '#9810FA' : 'transparent'} />
                    </span>
                    <span className={`font-hfont font-semibold ${activeTab === 'moments' ? 'text-[#9810FA]' : 'text-gray-500'}`}>Moments</span>
                </li>



                {/* //requests tab */}
                <li
                    className={`flex justify-center items-center flex-col  px-4 py-2  rounded-xl ${activeTab === 'requests' ? 'bg-[#E0F7F8]' : ''}`}
                    onClick={() => setActiveTab('requests')}>
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
