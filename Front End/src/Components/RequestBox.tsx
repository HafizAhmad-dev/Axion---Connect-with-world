import { Dot } from 'lucide-react';
import PhotoHolder from './PhotoHolder'
import ReqBtns from './ReqBtns';

type Props = {
    id:string;
    name:string;
    mutualFriends:number;
    time:string;
}
const RequestBox = ({id, name, mutualFriends, time}: Props) => {
    return (
        <div key={id} className=' px-3 py-4 rounded-xl shadow-requestscard'>
            <div className="details flex gap-2">
                <PhotoHolder css='h-12 w-12 bg-gradient-to-br from-teal-400 to-blue-500 ' />
                <div className="">
                    <h2 className='text-md font-semibold'>{name}</h2>
                    <div className='flex text-[13px] font-semibold   text-gray-400'>
                        <span className=''>{mutualFriends} Mutual Friends</span>
                        <Dot size={20} className='' />
                        <span className=''>{time}</span>
                    </div>
                </div>
            </div>
            <div className=" flex justify-evenly mt-5">
              <ReqBtns varient='accept'/>
              <ReqBtns varient='decline'/>
            </div>
        </div>
    )
}

export default RequestBox
