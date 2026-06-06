import { TapEventLabelMapper, TapsListTableColumnsNames } from './types';

export const TapEventLabelMap: TapEventLabelMapper = {
  TapIn: 'Tap In',
  TapOut: 'Tap Out',
  Success: 'Success',
  Declined: 'Declined',
  SystemError: 'System Error',
};

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
