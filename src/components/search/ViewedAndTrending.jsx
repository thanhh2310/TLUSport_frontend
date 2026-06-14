import React from "react";
import ViewedItemCard from "../card/search/ViewedItemCard";
import useRecentlyViewedStore from "@/store/useRecentlyViewedStore";

const ViewedAndTrending = ({ onSelectTag }) => {
  const viewedProducts = useRecentlyViewedStore(
    (state) => state.viewedProducts,
  );
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
      {viewedProducts && viewedProducts.length > 0 && (
        <div className="w-full">
          <h1 className="text-lg font-semibold">Sản phẩm đã xem gần đây</h1>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {viewedProducts.slice(0, 4).map((product, index) => (
              <ViewedItemCard key={product.id || index} productData={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewedAndTrending;
