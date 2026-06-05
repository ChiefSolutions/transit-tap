export interface TapEventLabelMapper {
  TapIn: string;
  TapOut: string;
  Success: string;
  DeniedInsufficientFunds: string;
  SystemError: string;
  [key: string]: string;
}

export interface TapsListTableColumnsNames {
  name: string;
  text: string;
}
