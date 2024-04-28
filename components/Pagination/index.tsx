import React from "react";
import { useTranslations } from "next-intl";

interface PaginationProps {
  total: number;
  limit: number;
  page: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ total, limit, page, onChange }) => {
  const t = useTranslations();
  const totalPages = Math.ceil(total / limit);
  const visiblePages = 5; // 可见页码数
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(totalPages, page + 2);

  // 确保总是显示五个页码
  if (startPage === 1) {
    endPage = Math.min(startPage + visiblePages - 1, totalPages);
  } else if (endPage === totalPages) {
    startPage = Math.max(endPage - visiblePages + 1, 1);
  }

  const handleClick = (newPage: number) => {
    if (newPage !== page && newPage > 0 && newPage <= totalPages) {
      onChange(newPage);
    }
  };

  const paginationItems = [];
  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <button
        key={i}
        onClick={() => handleClick(i)}
        aria-current={page === i ? "page" : undefined}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
          page === i ? "bg-main text-white" : "text-gray-700 bg-white"
        } hover:bg-main hover:text-white duration-300`}
      >
        {i}
      </button>
    );
  }

  if (startPage > 1) {
    paginationItems.unshift(
      <span key="start-ellipsis"
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
        ...
      </span>
    );
  }

  if (endPage < totalPages) {
    paginationItems.push(
      <span key="end-ellipsis"
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
        ...
      </span>
    );
  }

  return (
    <div className="flex items-center my-4 justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex sm:flex-1 md:items-center md:justify-between items-center max-md:flex-col w-full">
        <div>
          <div className="text-sm text-gray-700">
            <p className="text-sm text-gray-700">
              {t("common.Showing")} <span className="font-medium">{(page - 1) * limit + 1}</span> {t("common.to")}{" "}
              <span className="font-medium">{Math.min(page * limit, total)}</span> {t("common.of")}{" "}
              <span className="font-medium">{total}</span> {t("common.results")}
            </p>
          </div>
        </div>
        <div className="max-md:mt-6">
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => handleClick(page - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50"
              disabled={page === 1}
            >
              <span className="sr-only">{t("common.Previous")}</span>
              <i className="ri-arrow-left-s-line ri-xl"></i>
            </button>
            {paginationItems}
            <button
              onClick={() => handleClick(page + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50"
              disabled={page === totalPages}
            >
              <span className="sr-only">{t("common.Next")}</span>
              <i className="ri-arrow-right-s-line ri-xl"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
