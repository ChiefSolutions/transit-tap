import { TapTableRow, Tap, TapEventsSummary, TapResponse } from '../../src/app/taps/models';

export const mockTapEventsResponse: TapResponse[] = [
  {
    tap: {
      eventId: '0b02b582-3223-44b4-81d9-f03aa11a3ac7',
      deviceId: 'fee64746-180b-4536-aadf-2629e11ece9a',
      deviceName: 'BUS LINE 02',
      timestamp: '2026-06-03T21:18:50.279563Z',
      cardToken: 'tkn_27rSqew9gZSjJ45xSi1yqKfa',
      event: 'TapOut',
      status: 'Success',
    },
    summary: {
      total: 1,
      tapIns: 0,
      tapOuts: 1,
      declined: 0,
      errors: 0,
    },
  },
  {
    tap: {
      eventId: '1912d641-0fb0-4aeb-95e8-a6dae221812e',
      deviceId: 'fee64746-180b-4536-aadf-2629e11ece9a',
      deviceName: 'BUS LINE 02',
      timestamp: '2026-06-03T21:18:52.00547Z',
      cardToken: 'tkn_27rSqew9gZSjJ45xSi1yqKfa',
      event: 'TapIn',
      status: 'Success',
    },
    summary: { total: 2, tapIns: 1, tapOuts: 1, declined: 0, errors: 0 },
  },
  {
    tap: {
      eventId: '5e227aba-8403-43c4-b9b3-40f756bcea59',
      deviceId: 'fee64746-180b-4536-aadf-2629e11ece9a',
      deviceName: 'BUS LINE 02',
      timestamp: '2026-06-03T21:18:53.032196Z',
      cardToken: 'tkn_27rSqew9gZSjJ45xSi1yqKfa',
      event: 'TapOut',
      status: 'DeniedInsufficientFunds',
    },
    summary: {
      total: 3,
      tapIns: 1,
      tapOuts: 2,
      declined: 1,
      errors: 0,
    },
  },
  {
    tap: {
      eventId: '086c5c94-cc59-4fd5-8335-ffb572fb85e8',
      deviceId: 'fee64746-180b-4536-aadf-2629e11ece9a',
      deviceName: 'BUS LINE 02',
      timestamp: '2026-06-03T21:18:54.683526Z',
      cardToken: 'tkn_27rSqew9gZSjJ45xSi1yqKfa',
      event: 'TapOut',
      status: 'DeniedInsufficientFunds',
    },
    summary: { total: 4, tapIns: 1, tapOuts: 3, declined: 2, errors: 0 },
  },
];

export const mockTapTableRowData: TapTableRow[] = mockTapEventsResponse.map((response) => {
  const { tap } = response;
  const { deviceName, event, eventId, status, timestamp } = tap;

  return { deviceName, event, eventId, status, timestamp };
});

// Get from last event in mockTapEventsResponse
export const mockSummary: TapEventsSummary = {
  total: 4,
  tapIns: 1,
  tapOuts: 3,
  declined: 2,
  errors: 0,
};
