// Components/SearchUser.input.tsx
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

type SearchUserProps = {
  query: string;
  setQuery: (value: string) => void;
  autoFocus?: boolean;
  onClick?: () => void;
};

const SearchUser = ({ 
  query, 
  setQuery, 
  autoFocus = false,
  onClick 
}: SearchUserProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div 
      className="border flex items-center px-2 py-1 gap-4 rounded-lg border-gray-300 shadow-sm bg-white"
      onClick={onClick}
    >
      <Search size={15} color="#6B7280" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search Users"
        className="w-full focus:outline-none placeholder:text-[15px]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchUser;