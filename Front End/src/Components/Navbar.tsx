import { useState } from "react";
import { GoClock } from "react-icons/go";
import { LuUserPlus } from "react-icons/lu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons'; // solid version
import { faComment as faCommentOutline } from '@fortawesome/free-regular-svg-icons'; // outline version
import { MessageCircle } from 'lucide-react';


type tabs = 'chats' | 'moments' | 'requests';

const Navbar = () => {
    const [activeTab, setActiveTab] = useState<tabs>('chats');
    return (
        <nav className=" py-2 bg-white  ">
            <ul className="flex justify-around">
                {/* //chat tab */}
                <li className={`flex justify-center items-center flex-col  px-4 py-2  rounded-xl ${activeTab === 'chats' ? 'bg-[#F1F6FF]' : ''}`} onClick={() => setActiveTab('chats')}>
                    <span className="icon">
                        <MessageCircle size={24}
                            strokeWidth={1.5}
                            color={activeTab === 'chats' ? '#4D72FF' : 'black'}
                            fill={activeTab === 'chats' ? '#4D72FF' : 'transparent'} />

                    </span>
                    <span className={`text font-semibold ${activeTab === 'chats' ? 'text-[#4D72FF]' : 'text-gray-500'}`} >Chats</span>
                </li>

                {/* //moments tab */}
                <li className="flex justify-center items-center flex-col px-4 py-2  rounded-xl">
                    <span className="icon"><GoClock strokeWidth={0.1} size={24} /></span>
                    <span className='text'>Moments</span>
                </li>

                {/* //requests tab */}
                <li className="flex justify-center items-center flex-col  px-4 py-2  rounded-xl">
                    <span className="icon"><LuUserPlus size={24} strokeWidth={1.5} /></span>
                    <span className='text'>Requests</span>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
