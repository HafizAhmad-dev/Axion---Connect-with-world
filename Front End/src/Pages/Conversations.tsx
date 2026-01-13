import { Search } from 'lucide-react';
import { mockContacts } from '../Components/Users';
import PhotoHolder from '../Components/PhotoHolder';

const Home = () => {
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
                {mockContacts.map((user) => (
                    <div key={user.id} className="User flex justify-between px-2 py-2 hover:shadow-usercard rounded-xl ">
                        {/* //div with image and main content */}
                        <div className='flex items-center gap-2'>
                            <PhotoHolder css='h-11 w-11' />
                            <div className="main">
                                <h2 className='font-semibold'>{user.name}</h2>
                                <p className='text-sm text-gray-500'>{user.lastMessage}</p>
                            </div>
                        </div>

                        {/* // unread messages count and time */}
                        <div className="right  flex flex-col flex-end justify-center">
                            {user.unread && (<p className="unreadMsgsCount text-center text-[12px] rounded-full h-5 w-5 bg-linear-to-br from-[#9189ff] to-[#9f3fff] text-white font-semibold">{user.unread}</p>)}
                            <p className={`time text-[12px] text-gray-400 font-semibold ${user.unread ? '' : 'mt-4'}`}>{user.time}</p>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    )
}

export default Home


