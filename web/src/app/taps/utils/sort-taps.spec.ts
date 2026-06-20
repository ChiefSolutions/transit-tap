import { mockTapTableRowData } from 'tests/mocks/data';
import { TableSort } from '../types';
import { sortTaps } from './sort-taps';

describe('SortTaps', () => {
  const mockRows = mockTapTableRowData;

  describe('when the direction is none', () => {
    it('should return the original rows unmodified if direction is "none"', () => {
      const sort: TableSort = { column: 'deviceName', direction: 'none' };
      const result = sortTaps(mockRows, sort);

      expect(result).toEqual(mockRows);
    });
  });

  describe('when the direction is asc', () => {
    it('should sort strings in ascending order ("asc")', () => {
      const sort: TableSort = { column: 'deviceName', direction: 'asc' };
      const result = sortTaps([...mockRows], sort);

      expect(result[0].deviceName).toBe('BUS LINE 01');
      expect(result[1].deviceName).toBe('BUS LINE 03');
      expect(result[2].deviceName).toBe('BUS LINE 03');
    });
  });

  describe('when the direction is desc', () => {
    it('should sort strings in descending order ("desc")', () => {
      const sort: TableSort = { column: 'deviceName', direction: 'desc' };
      const result = sortTaps([...mockRows], sort);

      expect(result[0].deviceName).toBe('TRAM LINE 03');
      expect(result[1].deviceName).toBe('TRAM LINE 02');
      expect(result[2].deviceName).toBe('TRAM LINE 01');
    });
  });
});
