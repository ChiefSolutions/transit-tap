import { ICONS } from './icons.constant';

export interface TapEventLabelMapper {
  TapIn: string;
  TapOut: string;
  Success: string;
  Declined: string;
  SystemError: string;
  [key: string]: string;
}

export interface TapsListTableColumnsNames {
  name: string;
  text: string;
}

export type IconKey = keyof typeof ICONS;
