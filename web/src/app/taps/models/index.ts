import { TapEventLabelMap } from '../../constants';

export type TapStatus = 'Success' | 'DeniedInsufficientFunds' | 'SystemError';
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
  [key: string]: string;
}

export interface TapRowWithStats {
  tap: TapTableRow;
  summary: TapEventsSummary;
}

export interface TapStat {
  label: string;
  value: number;
}
