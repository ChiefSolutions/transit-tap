import { TapEventLabelMap } from '../../constants';
import { IconKey } from '../../constants/types';

export type TapStatus = 'Success' | 'Declined' | 'SystemError';
export type TapEvent = 'TapIn' | 'TapOut';
type TapRowEventLabel = (typeof TapEventLabelMap)[keyof typeof TapEventLabelMap];

export interface Tap {
  eventId: string;
  deviceId: string;
  deviceName: string;
  timestamp: string;
  cardToken: string;
  event: TapEvent;
  status: TapStatus;
}

export interface TapEventsSummary {
  total: number;
  tapIns: number;
  tapOuts: number;
  declined: number;
  errors: number;
}

export interface TapResponse {
  tap: Tap;
  summary: TapEventsSummary;
}

export interface TapTableRow {
  eventId: string;
  deviceName: string;
  timestamp: string;
  event: TapEvent;
  status: TapRowEventLabel;
}

export interface TapRowWithStats {
  tap: TapTableRow;
  summary: TapEventsSummary;
}

export type TapStatName = TapEvent | TapStatus | 'Total';
export interface TapStat {
  name: TapStatName;
  label: string;
  value: number;
  icon: IconKey;
}

export type SortDirection = 'none' | 'asc' | 'desc';

export interface TableSort {
  direction: SortDirection;
  column: keyof TapTableRow;
}
