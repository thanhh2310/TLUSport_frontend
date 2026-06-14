import React, { useState, useEffect, useRef } from "react";
import ListProItemCard from "@/components/card/home/ListProItemCard";
import productServices from "@/services/productServices";
import aiServices from "@/services/aiServices";
import { shuffleArray } from "@/lib/shuffleArray";
import useAuthStore from "@/store/useAuthStore";
import { getPaginationRange } from "@/lib/utils";

const AiRecommendations = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuthStore();
  const titleRef = useRef(null);
  const isMounted = useRef(false);

  const fetchProducts = async (pageNumber) => {
    if (authLoading) return;
    setLoading(true);
    try {
      if (user?.userId) {
        // Thử nghiệm gọi API recommend từ backend AI (Python)
        const res = await aiServices.getRecommendations(user.userId, 8);
        console.log("Response from AI service:", res);

        if (res?.product_ids && res.product_ids.length > 0) {
          const productDetails = await Promise.all(
            res.product_ids.map(async (id) => {
              try {
                const productRes = await productServices.getProductDetail(id);
                return productRes.data;
              } catch (err) {
                console.error(`Lỗi khi lấy chi tiết sản phẩm ${id}:`, err);
                return null;
              }
            }),
          );
          const validProducts = productDetails.filter(
            (p) => p && p.isActive === true,
          );
          setProducts(shuffleArray(validProducts));
          setTotalPages(1); // Gợi ý AI không phân trang
          return;
        }
      }

      // Khách chưa đăng nhập hoặc Fallback nếu không có gợi ý từ AI
      const res = await productServices.getAllProducts(pageNumber, 8);
      if (res?.data?.items) {
        setProducts(shuffleArray(res.data.items));
        setTotalPages(res.data.totalPage || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải AI recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchProducts(page);
    }
  }, [page, authLoading, user]);

  useEffect(() => {
    if (isMounted.current) {
      if (!loading) {
        const element = titleRef.current;
        if (element) {
          const yOffset = -100; // Trừ hao khoảng 100px để không bị header sticky che mất tiêu đề
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    } else {
      isMounted.current = true;
    }
  }, [loading]);

  return (
    <div className="space-y-15 mb-20">
      {/* <div className="w-full relative ">
        <img
          src="/banner/productBannerAI.jpg"
          alt="productBanner"
          className="w-full object-cover object-center aspect-4/3 md:aspect-19/6"
        />
        <div className="absolute bottom-1/2 left-0 px-15 text-left ">
          <h2 className="text-6xl font-bold text-gray-900 italic">
            AI <span className="text-blue-500">gợi ý </span> cho bạn
          </h2>
          <p className="text-gray-500 mt-4 text-xl">
            Cá nhân hóa phong cách thể thao theo bạn
          </p>
        </div>
      </div> */}
      <div className="px-15">
        <div ref={titleRef} className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-medium text-neutral-800 ">
            Gợi ý cho bạn
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex flex-col gap-4 animate-pulse"
                >
                  <div className="bg-neutral-200 rounded-xl aspect-3/4 w-full" />
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-neutral-200 rounded-full" />
                    <div className="w-10 h-6 bg-neutral-200 rounded-full" />
                  </div>
                  <div className="bg-neutral-200 h-4 w-3/4 rounded" />
                  <div className="bg-neutral-200 h-4 w-1/2 rounded" />
                </div>
              ))
            : products.map((product, index) => (
                <div key={product.id ? `${product.id}-${index}` : index}>
                  <ListProItemCard productData={product} />
                </div>
              ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className={`hidden sm:flex items-center justify-center h-8 sm:h-10 px-2.5 sm:px-4 rounded-full border border-neutral-300 text-xs sm:text-sm font-medium hover:bg-neutral-100 transition-all duration-300 ${
                page === 1 || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <span className="hidden sm:inline">Trước</span>
            </button>

            {getPaginationRange(page, totalPages).map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`dots-${idx}`}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-400 select-none font-bold animate-pulse text-xs sm:text-sm"
                  >
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={loading}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border text-xs sm:text-sm font-medium flex items-center justify-center transition-all duration-300 ${
                    p === page
                      ? "bg-neutral-800 text-white border-neutral-800"
                      : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className={`hidden sm:flex items-center justify-center h-8 sm:h-10 px-2.5 sm:px-4 rounded-full border border-neutral-300 text-xs sm:text-sm font-medium hover:bg-neutral-100 transition-all duration-300 ${
                page === totalPages || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <span className="hidden sm:inline">Sau</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiRecommendations;
