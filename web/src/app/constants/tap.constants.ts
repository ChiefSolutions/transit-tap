import { TapEventLabelMapper, TapsListTableColumnsNames } from './types';

export const TapEventLabelMap: TapEventLabelMapper = {
  TapIn: 'Tap In',
  TapOut: 'Tap Out',
  Success: 'Success',
  Declined: 'Declined',
  SystemError: 'System Error',
} as const;

export const TapsListTableColumns: TapsListTableColumnsNames[] = [
  {
    name: 'deviceName',
    text: 'Device Name',
  },
  {
    name: 'timestamp',
    text: 'Timestamp',
  },
  {
    name: 'event',
    text: 'Event',
  },
  {
    name: 'status',
    text: 'Status',
  },
];

export const tableSkeleton = Array.from({ length: 4 }, (_, i) => i);
