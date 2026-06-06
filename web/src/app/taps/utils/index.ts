import { TapTableRow } from '../types';

export const getDefaultTapEventsSummary = () => ({
  total: 0,
  tapIns: 0,
  tapOuts: 0,
  declined: 0,
  errors: 0,
});

export function sortTapsResponseData(rows: TapTableRow[], column: keyof TapTableRow, direction: 'asc' | 'desc' | 'none'): TapTableRow[] {
  const isAsc = direction === 'asc';

  return rows.sort((a, b) => {
    if (a[column] === b[column]) {
      return 0;
    }

    const cmp = a[column] > b[column] ? 1 : -1;
    return isAsc ? cmp : -cmp;
  });
}
