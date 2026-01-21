import HighlightCard from "../Components/HighlightCard"
import UserHighlight from "../Components/UserHighlight"
import { useSelector } from 'react-redux'
import type { RootState } from "../Store/store"

const Highlight = () => {
  // Get the highlights array from the Redux store
  const HighlightsData = useSelector((state: RootState) => state.highlights.highlights);
 


  return (
    <div className="h-full px-3 py-3 bg-highlight-section overflow-auto no-scrollbar">

      {/* ===== User's own Highlight section ===== */}
      <UserHighlight />

      {/* ===== Recent Highlights ===== */}
      <div className="mt-6">
       { HighlightsData.filter(hg => !hg.seen).length > 0 && <p className='text-gray-400 font-semibold text-sm'>Recent Highlights</p>}
        {
          // Filter highlights that are NOT seen yet
          // Map over them and render a HighlightCard for each
          HighlightsData
            .filter(hg => !hg.seen)
            .map(hg =>
              <HighlightCard
                key={hg.id} 
                id={hg.id}               // unique key for React list rendering
                highlights  ={hg.highlight}  // array of individual highlights for this user
                name={hg.user}             // username
                time={hg.time}             // time of highlight
                statusCount={hg.highlight.length} // number of highlights to show badge
              />
            )
        }
      </div>

      {/* ===== Viewed Highlights ===== */}
      <div className="mt-6">
       { HighlightsData.filter(hg => hg.seen).length > 0 && <p className='text-gray-400 font-semibold text-sm'>Viewed Highlights</p>}
        {
          // Filter highlights that have already been seen
          // Map over them and render a HighlightCard for each
          HighlightsData
            .filter(hg => hg.seen)
            .map(hg =>
              <HighlightCard
                key={hg.id}
                id={hg.id}
                highlights={hg.highlight}
                name={hg.user}
                time={hg.time}
                statusCount={hg.highlight.length}
              />
            )
        }
      </div>
    </div>
  )
}

export default Highlight
