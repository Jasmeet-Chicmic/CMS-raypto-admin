import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchInputProps) => {
  return (
    <div className={`relative rounded-[8px] ${className}`}>
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1b2559] dark:text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10 pl-4 py-2 border border-[#f4f7fe] rounded-lg w-full dark:bg-gray-900 dark:border-gray-800 dark:text-white"
      />
    </div>
  );
};

export default SearchInput;
