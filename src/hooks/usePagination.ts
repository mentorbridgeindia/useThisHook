import { useCallback, useState } from 'react';

export interface PaginationOptions {
  total: number;
  pageSize?: number;
  initialPage?: number;
}

function pageCountOf(total: number, pageSize: number) {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(Math.max(0, total) / pageSize));
}

export const usePagination = ({
  total,
  pageSize: initialPageSize = 10,
  initialPage = 1,
}: PaginationOptions) => {
  const [pageSize, setPageSize] = useState(initialPageSize);
  const pageCount = pageCountOf(total, pageSize);
  const [page, setPage] = useState(initialPage);
  const safePage = Math.min(page, pageCount);

  if (safePage !== page) setPage(safePage);

  const goToPage = useCallback(
    (nextPage: number) => {
      setPage(Math.min(pageCount, Math.max(1, nextPage)));
    },
    [pageCount],
  );

  const changePageSize = useCallback((nextSize: number) => {
    setPageSize(Math.max(1, nextSize));
    setPage(1);
  }, []);

  const next = useCallback(() => {
    goToPage(safePage + 1);
  }, [safePage, goToPage]);

  const prev = useCallback(() => {
    goToPage(safePage - 1);
  }, [safePage, goToPage]);

  return {
    page: safePage,
    pageSize,
    total,
    pageCount,
    offset: (safePage - 1) * pageSize,
    canNext: safePage < pageCount,
    canPrev: safePage > 1,
    setPage: goToPage,
    setPageSize: changePageSize,
    next,
    prev,
  } as const;
};
