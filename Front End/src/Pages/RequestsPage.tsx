import RequestBox from '../Components/RequestBox'
import {requests} from '../MockData/MockRequests'

type FriendRequest = {
    id:string;
    name:string;
    mutualFriends:number;
    time:string;
}

const RequestsPage = () => {

  return (
    <div className='h-full px-3 py-3 flex flex-col gap-4 bg-white overflow-auto no-scrollbar'>
        {requests.map((req:FriendRequest) => (
            <RequestBox key={req.id} id={req.id} name={req.name} mutualFriends={req.mutualFriends} time={req.time} />
        ))}
    </div>
  )
}

export default RequestsPage
