import HighlightCard from "../Components/HighlightCard";
import UserHighlight from "../Components/UserHighlight";
import { useHighlights } from "../hooks/useHighligts.hook";

const Highlight = () => {
  const friendsHighlights = useHighlights();

  const unviewedHighlights = friendsHighlights
    .map((friend) => ({
      ...friend,
      highlights: friend.highlights.filter(
        (highlight) => !highlight.viewed,
      ),
    }))
    .filter((friend) => friend.highlights.length > 0);

  const viewedHighlights = friendsHighlights
    .map((friend) => ({
      ...friend,
      highlights: friend.highlights.filter(
        (highlight) => highlight.viewed,
      ),
    }))
    .filter((friend) => friend.highlights.length > 0);

  return (
    <div className="h-full px-3 py-3 bg-highlight-section overflow-auto no-scrollbar">
      <UserHighlight />

      {/* Unviewed */}
      {unviewedHighlights.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-400 font-semibold text-sm">
            Recent Highlights
          </p>

          {unviewedHighlights.map((friend) => (
            <HighlightCard
              key={friend.userId}
              id={friend.userId}
              highlights={friend.highlights}
              name={friend.displayName}
            />
          ))}
        </div>
      )}

      {/* Viewed */}
      {viewedHighlights.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-400 font-semibold text-sm">
            Viewed Highlights
          </p>

          {viewedHighlights.map((friend) => (
            <HighlightCard
              key={friend.userId}
              id={friend.userId}
              highlights={friend.highlights}
              name={friend.displayName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Highlight;