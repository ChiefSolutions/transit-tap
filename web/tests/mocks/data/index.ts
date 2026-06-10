import { TapTableRow, TapEventsSummary, TapResponse } from '../../../src/app/taps/types';
import { mapTapEventResponse } from 'tests/utils';
import data from '../../data/data.json';

export const mockTapEventsResponse: TapResponse[] = data.taps as TapResponse[];

export const mockTapTableRowData: TapTableRow[] = mockTapEventsResponse.map(mapTapEventResponse);

// Get from last event in mockTapEventsResponse
export const mockSummary: TapEventsSummary = { total: 6, tapIns: 3, tapOuts: 3, declined: 3, errors: 0 };
