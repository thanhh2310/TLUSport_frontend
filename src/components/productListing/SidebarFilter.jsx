import React, { useState, useEffect } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const SidebarFilter = ({ availableFilters, selectedAttributes, setSelectedAttributes, selectedCategoryId, setSelectedCategoryId, minPrice, setMinPrice, maxPrice, setMaxPrice, isMobile = false }) => {
  const priceRanges = [
    { label: "Tất cả", min: "", max: "" },
    { label: "Dưới 100.000đ", min: "0", max: "100000" },
    { label: "100.000đ - 200.000đ", min: "100000", max: "200000" },
    { label: "200.000đ - 500.000đ", min: "200000", max: "500000" },
    { label: "Trên 500.000đ", min: "500000", max: "" },
  ];

  const handlePriceSelect = (range) => {
    setMinPrice(range.min);
    setMaxPrice(range.max);
  };
  const handleToggle = (valueId) => {
    if (!setSelectedAttributes) return;
    setSelectedAttributes(prev => {
      if (prev.includes(valueId)) {
        return prev.filter(id => id !== valueId);
      }
      return [...prev, valueId];
    });
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategoryId(prev => prev === catId ? null : catId);
    setSelectedAttributes([]);
  };

  const handleClearAll = () => {
    if (setSelectedAttributes) setSelectedAttributes([]);
    if (setSelectedCategoryId) setSelectedCategoryId(null);
    if (setMinPrice) setMinPrice("");
    if (setMaxPrice) setMaxPrice("");
  };

  const hasActiveFilters = 
    (selectedAttributes && selectedAttributes.length > 0) || 
    selectedCategoryId !== null || 
    minPrice !== "" || 
    maxPrice !== "";

  const sizes = availableFilters?.sizes || [];
  const colors = availableFilters?.colors || [];
  const categories = availableFilters?.categories || [];

  return (
    <div className={isMobile ? "w-full pb-10" : "w-100 sticky top-28 pr-5 self-start"}>
      <div className="flex justify-between items-center mb-2">
        {isMobile ? (
          <span className="text-sm text-neutral-500 font-medium">Tùy chọn hiển thị</span>
        ) : (
          <h2 className="text-xl text-neutral-900 font-medium">Bộ lọc</h2>
        )}
        {hasActiveFilters && (
          <button 
            onClick={handleClearAll}
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            Xóa tất cả
          </button>
        )}
      </div>
      <hr className="bg-neutral-900/10 my-3" />
      <Accordion
        type="multiple"
        defaultValue={["category", "price", "size", "color"]}
        className="max-w-lg space-y-4"
      >
        {categories.length > 0 && (
          <AccordionItem value="category" key="category">
            <AccordionTrigger className="font-bold text-md text-neutral-900 cursor-pointer hover:no-underline">
              Danh mục
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map(cat => {
                  const isActive = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border cursor-pointer ${
                        isActive
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}


        {sizes.length > 0 && (
          <AccordionItem value="size" key={"size"}>
            <AccordionTrigger className="font-bold text-md text-neutral-900 cursor-pointer hover:no-underline">
              Kích thước
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 mt-2">
                {sizes.map(size => {
                  const isSelected = selectedAttributes?.includes(size.valueId) || false;
                  return (
                    <button
                      key={size.valueId}
                      onClick={() => handleToggle(size.valueId)}
                      className={`min-w-10 h-10 px-3 flex items-center justify-center rounded-lg border text-sm font-semibold transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm scale-95'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100'
                      }`}
                    >
                      {size.valueName}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {colors.length > 0 && (
          <AccordionItem value="color" key={"color"}>
            <AccordionTrigger className="font-bold text-md text-neutral-900 cursor-pointer hover:no-underline">
              Màu sắc
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-3 mt-2 px-1">
                {colors.map(color => {
                  const isSelected = selectedAttributes?.includes(color.valueId) || false;
                  const colorCode = color.description || '#000';
                  const isLightColor = colorCode.toLowerCase() === '#ffffff' || colorCode.toLowerCase() === '#fff' || colorCode.toLowerCase() === 'white';
                  return (
                    <button
                      key={color.valueId}
                      onClick={() => handleToggle(color.valueId)}
                      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
                        isSelected 
                          ? 'ring-2 ring-offset-2 ring-neutral-900' 
                          : 'hover:ring-1 hover:ring-offset-1 hover:ring-neutral-400'
                      } ${isLightColor ? 'border border-neutral-200' : ''}`}
                      style={{ backgroundColor: colorCode }}
                      title={color.valueName}
                    >
                      {isSelected && (
                        <span 
                          className={`w-2 h-2 rounded-full ${
                            isLightColor ? 'bg-neutral-900' : 'bg-white'
                          }`} 
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="price" key="price">
          <AccordionTrigger className="font-bold text-md text-neutral-900 cursor-pointer hover:no-underline">
            Mức giá
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 mt-2 px-1">
              {priceRanges.map((range, idx) => {
                const isActive = (minPrice || "") === range.min && (maxPrice || "") === range.max;
                return (
                  <button
                    key={idx}
                    onClick={() => handlePriceSelect(range)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100'
                    }`}
                  >
                    <span className="text-sm font-semibold">{range.label}</span>
                    <div 
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isActive 
                          ? 'border-white bg-white' 
                          : 'border-neutral-300'
                      }`}
                    >
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-neutral-900" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}

export default SidebarFilter;