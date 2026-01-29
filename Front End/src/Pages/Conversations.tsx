import { mockConversations } from '../MockData/MockConversation';
import { Search } from 'lucide-react';
import PhotoHolder from '../Components/PhotoHolder';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { mockContacts } from '../MockData/MockContacts';
import { setCurrentConversation } from '../Store/Slices/CurrentConversation';
import type { Conversation } from '../Types/Conversation.type';
import { setContacts } from '../Store/Slices/Contacts.slice';
import { useEffect } from 'react';
import type { RootState } from '../Store/store';

const Home = () => {
    const contacts = useSelector((state:RootState) => state.contacts.contacts);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setContacts(mockContacts));
    }, [dispatch]);

    function OpenChat(convo: Conversation) {
        dispatch(setCurrentConversation(convo));
        navigate('user/chat')
    }

    return (
        <div className='bg-home pb-10 h-full pt-3 px-3'>
            <div className="search border flex items-center px-2 py-1 gap-4 rounded-lg border-gray-300 shadow-sm ">
                <Search size={15}
                    color='#6B7280'
                />
                <input type="text" className='w-full focus:outline-none placeholder:text-[15px]' placeholder='Search Users' />
            </div>
            {/*  User List */}
            <div className="usersList flex flex-col gap-2 mt-2 max-h-full pt-2 overflow-auto no-scrollbar">

                {/* //User Card */}
                {mockConversations.map((convo) => {
                    const otherParticipantId = convo.participants.find(p => p !== "me");
                    const contact = contacts.find(c => c.id === otherParticipantId);
                    const contactName = contact?.username ?? "Unknown";

                    return (
                        <div
                            key={convo.id}
                            onClick={() => OpenChat(convo)}
                            className="User flex justify-between px-2 py-2 hover:shadow-usercard rounded-xl cursor-pointer"
                        >
                            <div className='flex items-center gap-2'>
                                <PhotoHolder css='h-11 w-11' username={contactName} />
                                <div className="main">
                                    <h2 className='font-gfont'>{contactName}</h2>
                                    <p className='text-sm text-gray-500 font-gfont'>{convo.lastMessage}</p>
                                </div>
                            </div>

                            <div className="right flex flex-col justify-center items-end">
                                {convo.unreadCount > 0 && (
                                    <p className="unreadMsgsCount text-center text-[12px] rounded-full h-5 w-5 bg-linear-to-br from-[#9189ff] to-[#9f3fff] text-white font-semibold">
                                        {convo.unreadCount}
                                    </p>
                                )}
                                <p className={`time text-[12px] text-gray-400 font-semibold ${convo.unreadCount ? '' : 'mt-4'}`}>
                                    {new Date(convo.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}


            </div>
        </div>
    )
}

export default Home


