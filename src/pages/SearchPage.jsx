import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ListProItemCard from '@/components/card/home/ListProItemCard';
import useProductStore from '@/store/useProductStore';
import { Loader2 } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  
  const searchResults = useProductStore((state) => state.searchResults);
  const isSearching = useProductStore((state) => state.isSearching);
  const searchProductsWithAI = useProductStore((state) => state.searchProductsWithAI);

  useEffect(() => {
    if (keyword) {
      searchProductsWithAI(keyword, 1, 24);
    }
  }, [keyword, searchProductsWithAI]);

  return (
    <div className="min-h-screen w-full px-16 mx-auto max-w-full">
      <Breadcrumbs />
      <div className="py-10">
        <h1 className="text-3xl font-semibold mb-8 text-neutral-800">
          Kết quả tìm kiếm cho: "{keyword}"
          {!isSearching && searchResults.length !== undefined && (
            <span className="text-lg text-neutral-500 font-normal ml-3">({searchResults.length} sản phẩm)</span>
          )}
        </h1>
        {isSearching ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-neutral-400" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-4 grid-cols-2 gap-y-8">
            {searchResults.map((product) => (
              <ListProItemCard key={product.id} productData={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-xl font-medium text-neutral-600">Không tìm thấy sản phẩm nào phù hợp với "{keyword}".</p>
            <p className="text-neutral-500">Vui lòng thử lại với từ khóa khác.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
