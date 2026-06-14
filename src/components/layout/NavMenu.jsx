import React from "react";
import { Link } from "react-router-dom";
import useCategoryStore from "@/store/useCategoryStore";
import useAuthStore from "@/store/useAuthStore";

const NavMenu = () => {
  const categoryTree = useCategoryStore((state) => state.categoryTree);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <nav className="h-full flex items-center static">
      <ul className="flex gap-12 text-xl font-bold rounded-md uppercase h-full items-center static">
        {/* Nút Trang chủ */}
        <li>
          <Link
            to="/"
            className="py-4 px-2 hover-underline-animation after:bg-neutral-900 after:h-0.5!"
          >
            Trang chủ
          </Link>
        </li>

        {/* Dynamic Root Categories with Mega Dropdown */}
        {categoryTree && categoryTree.length > 0 ? (
          categoryTree.map((category) => (
            <li
              key={category.id || category.name}
              className="h-full flex items-center static group cursor-pointer"
            >
              <div className="py-4 px-2 hover-underline-animation after:bg-neutral-900 after:h-0.5!">
                {category.name}
              </div>

              {/* Mega Dropdown */}
              {category.subCategories && category.subCategories.length > 0 && (
                <>
                  <div className="absolute top-full left-0 w-screen h-screen bg-black/50 backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-40 pointer-events-none"></div>

                  <div className="absolute top-full left-1/2 w-max min-w-300 max-w-350 bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-x-1/2 -translate-y-4 group-hover:-translate-x-1/2 group-hover:translate-y-0 z-50 border border-neutral-200 rounded-b-2xl cursor-default">
                    <div className="px-40 pt-4 pb-10 mx-auto w-full flex justify-center">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 w-full  ">
                        {category.subCategories.map((subLevel2) => (
                          <div
                            key={subLevel2.id}
                            className="flex flex-col space-y-3   "
                          >
                            <Link
                              to={`/list-products/${subLevel2.slug}`}
                              className="flex items-center gap-2 text-lg font-bold text-neutral-900 hover:text-blue-700 transition-colors uppercase "
                            >
                              {subLevel2.name}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 15 15"
                              >
                                <path
                                  fill="currentColor"
                                  d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"
                                />
                              </svg>
                            </Link>

                            <ul className="flex flex-col space-y-2">
                              <li>
                                <Link
                                  to={`/list-products/${subLevel2.slug}`}
                                  className="text-sm font-semibold text-neutral-800 hover:text-neutral-500 transition-colors"
                                >
                                  Tất cả
                                </Link>
                              </li>

                              {subLevel2.subCategories &&
                                subLevel2.subCategories.map((subLevel3) => (
                                  <li key={subLevel3.id}>
                                    <Link
                                      to={`/list-products/${subLevel3.slug}`}
                                      className="text-[15px] font-medium text-neutral-500 hover:text-black transition-colors normal-case"
                                    >
                                      {subLevel3.name}
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        ))}

                        {category.name?.toLowerCase() !== "phụ kiện" && (
                          <div className="flex flex-col space-y-3 items-center">
                            <p
                              // to={`/list-products`}
                              className="flex items-center gap-2 text-lg font-bold text-neutral-900 hover:text-blue-700 transition-colors uppercase"
                            >
                              Phụ kiện
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 15 15"
                              >
                                <path
                                  fill="currentColor"
                                  d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"
                                />
                              </svg>
                            </p>

                            <p
                              // to={`/list-products`}
                              className="group/card relative w-[80%] mt-2 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="aspect-4/3 w-full">
                                <img
                                  src={
                                    "https://res.cloudinary.com/dcowpjmzi/image/upload/v1777780628/phu-kien-khac_cuy7c5.avif"
                                  }
                                  alt={`Phụ kiện ${category.name}`}
                                  className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500"
                                />
                              </div>
                              <div className="absolute inset-0 bg-black/10 group-hover/card:bg-black/0 transition-colors"></div>
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 px-4 py-1.5 rounded-full text-[13px] font-bold text-neutral-800 shadow-sm whitespace-nowrap">
                                Khám phá ngay
                              </div>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <>
            <li>
              <Link
                to="/"
                className="py-4 px-2 hover-underline-animation after:bg-neutral-900 after:h-0.5!"
              >
                Nam
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="py-4 px-2 hover-underline-animation after:bg-neutral-900 after:h-0.5!"
              >
                Nữ
              </Link>
            </li>
          </>
        )}

        {/* Nút Yêu thích */}
        {isAuthenticated && (
          <li>
            <Link
              to="/wishlist"
              className="py-4 px-2 hover-underline-animation after:bg-neutral-900 after:h-0.5! relative flex items-center gap-1.5"
            >
              <span>Yêu thích</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavMenu;
