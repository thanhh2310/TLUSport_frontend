import React from "react";

const CategoryBanner = ({ data, selectedCategoryId }) => {
  return (
    <div className="my-10">
      <h1 className="uppercase text-2xl md:text-4xl font-semibold">
        {data?.name || "Danh mục"}
      </h1>
      {data?.subCategories && data.subCategories.length > 0 && (
        <div className="flex justify-start md:justify-center gap-4 md:gap-6 mt-6 md:mt-10 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar">
          {data.subCategories.map((subCategory) => {
            const isAnySelected =
              selectedCategoryId !== null && selectedCategoryId !== undefined;
            const isCurrentSelected = selectedCategoryId === subCategory.id;

            return (
              <div
                key={subCategory.id}
                className="cursor-pointer flex flex-col items-center gap-3 group shrink-0"
              >
                <div
                  className={`rounded-xl aspect-225/300 w-44 md:w-63 overflow-hidden border-2 transition-all duration-300
                    ${isCurrentSelected ? "border-neutral-900" : "border-transparent"}
                    ${isAnySelected && !isCurrentSelected ? "opacity-40 grayscale-[0.5]" : "opacity-100 grayscale-0"}
                  `}
                >
                  <img
                    src={subCategory.imageUrl}
                    alt={subCategory.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span
                  className={`font-bold leading-5 text-lg transition-colors 
                  ${isAnySelected && !isCurrentSelected ? "text-neutral-400" : "text-neutral-900"}`}
                >
                  {subCategory.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryBanner;
