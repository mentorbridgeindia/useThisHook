import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  it('derives offset and pageCount and clamps when total shrinks', () => {
    const { result, rerender } = renderHook(({ total }) => usePagination({ total, pageSize: 10 }), {
      initialProps: { total: 35 },
    });

    expect(result.current.pageCount).toBe(4);
    act(() => {
      result.current.setPage(4);
    });
    expect(result.current.page).toBe(4);
    expect(result.current.offset).toBe(30);
    expect(result.current.canNext).toBe(false);

    rerender({ total: 12 });
    expect(result.current.page).toBe(2);
    expect(result.current.pageCount).toBe(2);
  });

  it('resets to page 1 when page size changes', () => {
    const { result } = renderHook(() => usePagination({ total: 50, pageSize: 10 }));

    act(() => {
      result.current.setPage(3);
      result.current.setPageSize(25);
    });
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(25);
  });

  it('moves with next and prev', () => {
    const { result } = renderHook(() => usePagination({ total: 30, pageSize: 10 }));

    act(() => {
      result.current.next();
    });
    expect(result.current.page).toBe(2);
    expect(result.current.canPrev).toBe(true);

    act(() => {
      result.current.prev();
    });
    expect(result.current.page).toBe(1);
    expect(result.current.canPrev).toBe(false);
  });
});
