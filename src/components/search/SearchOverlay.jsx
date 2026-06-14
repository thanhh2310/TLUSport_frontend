import React, { useEffect, useState, useRef } from "react";
import ViewedAndTrending from "./ViewedAndTrending";
import SearchResults from "./SearchResults";
import useProductStore from "@/store/useProductStore";

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef(null);

  const searchProductsWithAI = useProductStore(
    (state) => state.searchProductsWithAI,
  );
  const isSearching = useProductStore((state) => state.isSearching);

  const handleSelectTag = (tag) => {
    setQuery(tag);
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      searchProductsWithAI(debouncedQuery, null, 4);
    }
  }, [debouncedQuery, searchProductsWithAI]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 300);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-100 bg-neutral-900/90 h-screen flex flex-col transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      onClick={onClose}
    >
      <div
        className="flex items-center px-4 md:px-16 py-4 md:py-6 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 max-w-2xl mx-auto flex items-center bg-neutral-300/50 rounded-full px-6 border border-transparent focus-within:border-neutral-600 transition-all">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 bg-transparent outline-none text-black font-semibold "
            placeholder="Bạn tìm gì hôm nay?"
          />
        </div>
        <button
          onClick={onClose}
          className="ml-4 font-medium  cursor-pointer text-neutral-500 hover:text-neutral-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 6L6 18M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className=" flex-1 mt-2 ">
        <div
          className="max-w-5xl mx-auto px-4 md:px-16 py-6 md:py-10 bg-white rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {query.length === 0 ? (
            <ViewedAndTrending onSelectTag={handleSelectTag} />
          ) : (
            <SearchResults
              onClose={onClose}
              query={debouncedQuery}
              onSelectTag={handleSelectTag}
            /> // Hiện khi đang gõ
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
