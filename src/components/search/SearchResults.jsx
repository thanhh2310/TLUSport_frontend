import React from "react";
import ResultItemCard from "../card/search/ResultItemCard";
import useProductStore from "@/store/useProductStore";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ onClose, query, onSelectTag }) => {
  const { searchResults, isSearching } = useProductStore();
  const navigate = useNavigate();

  const handleViewAll = () => {
    onClose();
    if (query) {
      navigate(`/search?keyword=${encodeURIComponent(query)}`);
    }
  };

  const hotKeywords = [
    "Áo thun",
    "Áo khoác",
    "Áo thun nam",
    "Áo thun nữ",
    "Đồ tập gym",
    "Đồ thể thao",
    "Đồ bơi",
    "Túi",
  ];
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold">Từ khóa nổi bật hôm nay</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {hotKeywords.map((keyword, index) => (
            <p
              key={index}
              className="rounded-2xl border cursor-pointer border-neutral-300 text-neutral-900 font-medium px-3 py-2 hover:bg-neutral-800 hover:text-white transition-all duration-200"
              onClick={() => onSelectTag(keyword)}
            >
              {keyword}
            </p>
          ))}
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-lg font-semibold">Kết quả tìm kiếm</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {isSearching ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-4 animate-pulse">
                <div className="w-full aspect-3/4 bg-neutral-200 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : searchResults.length > 0 ? (
            searchResults
              .slice(0, 4)
              .map((product) => (
                <ResultItemCard
                  key={product.id}
                  productData={product}
                  onClose={onClose}
                />
              ))
          ) : (
            <p className="text-neutral-500 py-4 col-span-4 text-center">
              Không tìm thấy sản phẩm nào phù hợp.
            </p>
          )}
        </div>
      </div>
      {searchResults.length > 0 && !isSearching && (
        <button
          onClick={handleViewAll}
          className="px-4 py-3 rounded-2xl bg-neutral-900 text-white font-medium text-lg cursor-pointer hover:bg-neutral-800 transition-colors mx-auto block mt-8"
        >
          Xem tất cả
        </button>
      )}
    </div>
  );
};

export default SearchResults;
