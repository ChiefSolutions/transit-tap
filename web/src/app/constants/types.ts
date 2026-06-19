import { ICONS } from './icons.constant';
import { TapTableRow } from '../taps/types';

export interface TapEventLabelMapper {
  TapIn: string;
  TapOut: string;
  Success: string;
  Declined: string;
  SystemError: string;
  [key: string]: string;
}

export interface TapsListTableColumnsNames {
  name: keyof TapTableRow;
  text: string;
}

export type IconKey = keyof typeof ICONS;
