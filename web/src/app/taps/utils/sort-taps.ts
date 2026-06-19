import { TapTableRow, TableSort } from '../types';

const stringCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function sortTaps(rows: TapTableRow[], sort: TableSort): TapTableRow[] {
  const { direction, column } = sort;

  if (direction === 'none') {
    return rows;
  }

  const isAsc = direction === 'asc';
  const data = [...rows];

  if (isAsc) {
    return data.sort((a, b) => stringCollator.compare(a[column] as string, b[column] as string));
  } else {
    return data.sort((a, b) => stringCollator.compare(b[column] as string, a[column] as string));
  }
}
