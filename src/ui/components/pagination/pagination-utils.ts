export const ELLIPSIS = '…' as const;

export type TPaginationRangeItem = number | typeof ELLIPSIS;

// Windowed page range with leading/trailing ellipses, e.g. 1 … 4 5 [6] 7 8 … 20
export const getPaginationRange = (
  page: number,
  pageCount: number,
  siblingCount: number,
): TPaginationRangeItem[] => {
  const totalVisible = siblingCount * 2 + 5; // first, last, current, 2 ellipses

  if (pageCount <= totalVisible) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, pageCount);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < pageCount - 1;

  const range: TPaginationRangeItem[] = [];

  range.push(1);
  if (showLeftEllipsis) range.push(ELLIPSIS);

  for (let i = Math.max(leftSibling, 2); i <= Math.min(rightSibling, pageCount - 1); i++) {
    range.push(i);
  }

  if (showRightEllipsis) range.push(ELLIPSIS);
  range.push(pageCount);

  return range;
};
