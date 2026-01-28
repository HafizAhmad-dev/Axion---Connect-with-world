import { Search } from 'lucide-react';
import { mockContacts } from '../MockData/MockUsers';
import PhotoHolder from '../Components/PhotoHolder';
import { useState } from 'react';
import UnderDev from '../Components/UnderDev';
import { setChatPartner } from '../Store/Slices/ChatPartner';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
const Home = () => {
    const [showChat,setShowChat] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function OpenChat(username:string,id:string){
        console.log(username,id)
        setShowChat(true);
        dispatch(setChatPartner({id,username}));
        navigate('user/chat')
    }

    if(showChat){
        return <UnderDev />
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
                {mockContacts.map((user) => {
                    return(
                    
                    <div onClick={() => OpenChat(user.name,user.id)} key={user.id} className="User flex justify-between px-2 py-2 hover:shadow-usercard rounded-xl ">
                        {/* //div with image and main content */}
                        <div className='flex items-center gap-2'>
                            <PhotoHolder css='h-11 w-11' username={user.name} />
                            <div className="main">
                                <h2 className='font-gfont '>{user.name}</h2>
                                <p className='text-sm text-gray-500 font-gfont'>{user.lastMessage}</p>
                            </div>
                        </div>

                        {/* // unread messages count and time */}
                        <div className="right  flex flex-col flex-end justify-center">
                            {user.unread > 0 && (<p className="unreadMsgsCount text-center text-[12px] rounded-full h-5 w-5 bg-linear-to-br from-[#9189ff] to-[#9f3fff] text-white font-semibold">{user.unread}</p>)}
                            <p className={`time text-[12px] text-gray-400 font-semibold ${user.unread ? '' : 'mt-4'}`}>{user.time}</p>
                        </div>

                    </div>
                )})}

            </div>
        </div>
    )
}

export default Home


