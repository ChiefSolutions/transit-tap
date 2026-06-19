import { TapTableRow, TableSort } from '../types';

export const getDefaultTapEventsSummary = () => ({
  total: 0,
  tapIns: 0,
  tapOuts: 0,
  declined: 0,
  errors: 0,
});

const stringCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function sortTapsResponseData(rows: TapTableRow[], sort: TableSort): TapTableRow[] {
  const { direction, column } = sort;
  if (!direction || direction === 'none' || !column) return rows;

  const isAsc = direction === 'asc';

  // 2. Optimization: Split the conditional checks OUTSIDE the hot loop
  if (isAsc) {
    return rows.sort((a, b) => stringCollator.compare(a[column] as string, b[column] as string));
  } else {
    // Reverse sorting is achieved by flipping the argument positions inside the collator
    return rows.sort((a, b) => stringCollator.compare(b[column] as string, a[column] as string));
  }
}
