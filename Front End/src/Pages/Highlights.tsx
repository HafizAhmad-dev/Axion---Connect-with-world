import HighlightCard from "../Components/HighlightCard"
import HighlightsData from "../Components/MockHiglights"
import UserHighlight from "../Components/UserHighlight"


const Highlight = () => {
  console.log(HighlightsData)
  return (
    <div className="h-full px-3 py-3 bg-highlight-section overflow-auto no-scrollbar">
      {/* User Highlight */}
      <UserHighlight />
      {/* //Recent Highlights */}
      <div className="mt-6">
        <p className='text-gray-400 font-semibold text-sm'>Recent Highlights</p>
        {Object.values(HighlightsData).map((hg) => (
          !hg.seen && <HighlightCard name={hg.user} time={hg.time} statusCount={hg.statuses.length} />
        ))}
      </div>
      {/* //Viewed Highlights */}
      <div className="mt-6">
        <p className='text-gray-400 font-semibold text-sm'>Viewed Highlights</p>
        {Object.values(HighlightsData).map((hg) => (
          hg.seen && <HighlightCard name={hg.user} time={hg.time} statusCount={hg.statuses.length} />
        ))}
      </div>
    </div>
  )
}

export default Highlight
