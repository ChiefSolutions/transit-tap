import { Component, WritableSignal, signal, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TapsRow } from '../row/taps-row';
import { TapsListTableColumns } from '../../../constants';
import { TapsListTableColumnsNames } from '../../../constants/types';
import { TapTableRow, TableSort, SortDirection } from '../../types';
import { tableSkeleton } from '../../../constants/tap.constants';

@Component({
  selector: 'app-taps-list-table',
  imports: [TapsRow],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TapsListTable {
  @Input({ required: true }) data: TapTableRow[] = [];
  @Input({ required: true }) isLoading = true;

  @Output() sortColumn = new EventEmitter<TableSort>();

  public readonly columnSort: WritableSignal<TableSort> = signal<TableSort>({
    direction: 'none',
    column: 'deviceName',
  });

  public skeletons = tableSkeleton;

  public columnNames: TapsListTableColumnsNames[] = TapsListTableColumns;

  public onColumnSort(name: keyof TapTableRow, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const sort = this.columnSort();
    let direction: SortDirection = 'asc';

    if (sort.column === name && sort.direction === 'asc') {
      direction = 'desc';
    }

    if (sort.column === name && sort.direction === 'desc') {
      direction = 'none';
    }

    const next = { column: name, direction };
    this.columnSort.set(next);
    this.sortColumn.emit(next);
  }
}
