import Breadcrumbs from "@/components/common/Breadcrumbs";
import CategoryBanner from "@/components/productListing/CategoryBanner";
import ListProductSection from "@/components/productListing/ListProductSection";
import SidebarFilter from "@/components/productListing/SidebarFilter";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import useCategoryStore from "@/store/useCategoryStore";
import productServices from "@/services/productServices";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ProductListingPage = () => {
  const { slug } = useParams();
  const categoryTree = useCategoryStore((state) => state.categoryTree);

  // Tìm kiếm đệ quy trong cây danh mục để lấy thông tin danh mục khớp với slug
  const findCategoryBySlug = (tree, targetSlug) => {
    if (!tree) return null;
    for (const cat of tree) {
      if (cat.slug === targetSlug) return cat;
      if (cat.subCategories && cat.subCategories.length > 0) {
        const found = findCategoryBySlug(cat.subCategories, targetSlug);
        if (found) return found;
      }
    }
    return null;
  };

  const category = findCategoryBySlug(categoryTree, slug);

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState({ items: [] });
  const [pagination, setPagination] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availableFilters, setAvailableFilters] = useState({
    sizes: [],
    colors: [],
    categories: [],
  });

  const [page, setPage] = useState(1);
  const [isAddingMore, setIsAddingMore] = useState(false);

  // Cập nhật danh sách subCategories khi category thay đổi
  useEffect(() => {
    setSelectedCategoryId(null);
    setAvailableFilters({
      sizes: [],
      colors: [],
      categories: category?.subCategories || [],
    });
  }, [category?.id]);

  // Reset page về 1 khi bất kỳ bộ lọc nào thay đổi và cuộn lên đầu trang
  useEffect(() => {
    setPage(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [
    category?.id,
    selectedCategoryId,
    sortBy,
    minPrice,
    maxPrice,
    JSON.stringify(selectedAttributes),
  ]);

  useEffect(() => {
    const fetchFilterProducts = async () => {
      if (!category?.id) return;
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsAddingMore(true);
      }
      try {
        const res = await productServices.filterProducts({
          pageNumber: page,
          pageSize: 12,
          categoryId: selectedCategoryId ?? category.id,
          sortBy: sortBy,
          attributeValueIds: selectedAttributes,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
        });

        if (page === 1) {
          setProducts(res.data);
        } else {
          setProducts((prev) => ({
            ...res.data,
            items: [...(prev?.items || []), ...(res.data?.items || [])],
          }));
        }

        setPagination({
          currentPage: res.data?.currentPage,
          pageSize: res.data?.pageSize,
          totalElements: res.data?.totalElements,
          totalPage: res.data?.totalPage,
        });

        // Lấy danh sách filter từ lần tải đầu tiên (khi chưa chọn filter nào)
        if (selectedAttributes.length === 0 && res.data?.items && page === 1) {
          const sizeMap = new Map();
          const colorMap = new Map();

          res.data.items.forEach((product) => {
            product.skus?.forEach((sku) => {
              sku.attributeValues?.forEach((attr) => {
                if (attr.attributeId === 2) sizeMap.set(attr.valueId, attr);
                if (attr.attributeId === 3) colorMap.set(attr.valueId, attr);
              });
            });
          });

          const sizeOrder = [
            "XXS",
            "XS",
            "S",
            "M",
            "L",
            "XL",
            "XXL",
            "2XL",
            "3XL",
            "4XL",
          ];
          const sizes = Array.from(sizeMap.values()).sort((a, b) => {
            const idxA = sizeOrder.indexOf(a.valueName?.toUpperCase());
            const idxB = sizeOrder.indexOf(b.valueName?.toUpperCase());
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            const numA = parseFloat(a.valueName);
            const numB = parseFloat(b.valueName);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.valueName.localeCompare(b.valueName);
          });

          setAvailableFilters((prev) => ({
            ...prev,
            sizes: sizes,
            colors: Array.from(colorMap.values()),
          }));
        }
      } catch (error) {
        console.error("Error fetching filter products:", error);
      } finally {
        if (page === 1) {
          setTimeout(() => {
            setIsLoading(false);
          }, 800);
        } else {
          setIsAddingMore(false);
        }
      }
    };
    fetchFilterProducts();
  }, [
    category?.id,
    selectedCategoryId,
    sortBy,
    minPrice,
    maxPrice,
    JSON.stringify(selectedAttributes),
    page,
  ]);

  return (
    <div className="min-h-screen w-full px-4 md:px-8 lg:px-16 mx-auto max-w-full">
      {/* <Breadcrumbs /> */}
      <CategoryBanner data={category} selectedCategoryId={selectedCategoryId} />
      <div className="flex flex-col lg:flex-row gap-5 py-6 lg:py-10">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block">
          <SidebarFilter
            availableFilters={availableFilters}
            selectedAttributes={selectedAttributes}
            setSelectedAttributes={setSelectedAttributes}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        </div>

        {/* Mobile Filter Drawer Trigger Button */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 border border-neutral-300 rounded-full px-5 py-3 text-md font-bold bg-white text-neutral-800 cursor-pointer shadow-sm hover:bg-neutral-50 active:bg-neutral-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                Bộ lọc
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-75 sm:w-100 overflow-y-auto pt-10"
            >
              <SheetHeader>
                <SheetTitle className="text-xl font-bold mb-4">
                  Bộ lọc sản phẩm
                </SheetTitle>
              </SheetHeader>
              <SidebarFilter
                availableFilters={availableFilters}
                selectedAttributes={selectedAttributes}
                setSelectedAttributes={setSelectedAttributes}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                isMobile={true}
              />
            </SheetContent>
          </Sheet>
        </div>

        <ListProductSection
          isLoading={isLoading}
          products={products}
          pagination={pagination}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          availableFilters={availableFilters}
          onLoadMore={() => setPage((p) => p + 1)}
          isAddingMore={isAddingMore}
        />
      </div>
    </div>
  );
};

export default ProductListingPage;
