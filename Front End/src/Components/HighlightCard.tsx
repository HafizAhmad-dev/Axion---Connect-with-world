import React, { useState } from 'react';
import PhotoHolder from './PhotoHolder'
import HighLightView from './HighLightView';
import type { Highlight } from '../MockData/MockHiglights';

type Props = {
    id:string;
    name: string;
    time: string;
    statusCount: number;
    highlights: Highlight[];
}

const HighlightCard = React.memo((data: Props) => {
    const [showHighlight, setShowHighlight] = useState(false);

    function changeHighlight() {
        setShowHighlight(true);
    };

    return (
        <>  
            {showHighlight && <HighLightView highlightsId={data.id} owner='other' onComplete={() => setShowHighlight(false)} />}

            <div className='flex gap-5 px-1 py-1 mt-4 hover:bg-white' onClick={changeHighlight}>
                <div className="avatar relative ">
                    <PhotoHolder css='h-12 w-12' />
                    {/* //highlist count circle */}
                    {data.statusCount > 0 && <div className='highlightCount absolute h-5 w-5 right-0 bottom-0 rounded-full bg-[#9810FA] border border-gray-300 flex justify-center items-center text-[12px] text-white' >{data.statusCount}</div>}
                </div>
                <div className='flex flex-col'>
                    <h2 className='font-semibold'>{data.name}</h2>
                    <p className='text-gray-500 text-[13px] font-semibold'>{data.time}</p>
                </div>
            </div>
        </>
    )
})

export default HighlightCard
