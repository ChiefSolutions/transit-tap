import { test as base, expect, Page, Locator } from '@playwright/test';
import path from 'path';
import { mockServerSideEvents, mockData } from '../utils';
import { MyCustomOptions } from '../../playwright.config';
import { sortTapsResponseData } from '../../src/app/taps/utils';
import { TableSort, TapTableRow } from '../../src/app/taps/types';
import { TapEventLabelMap } from '../../src/app/constants';

// Define the shape of your fixtures
interface DashboardFixtures {
  disconnectedDashboardPage: DashboardPage;
  liveDashboardPage: DashboardPage;
}

// Simple POM to encapsulate your locators/actions
export class DashboardPage {
  public page: Page;
  public heading: Locator;
  public indicatorLabel: Locator;
  public tableComponent: Locator;
  public columnHeaders: Locator;
  public noDataMessage: Locator;

  private readonly apiURL: string;

  constructor(page: Page, apiURL: string) {
    this.page = page;
    this.apiURL = apiURL;

    this.heading = this.page.locator('h1.TapsListHeader-heading');
    this.indicatorLabel = this.page.locator('span.TapsListHeader-liveIndicatorLabel');
    this.tableComponent = this.page.locator('app-taps-list-table');
    this.columnHeaders = this.page.locator('[data-testid="table-header-colum"]');
    this.noDataMessage = this.page.locator('span.TapsListTable-noDataLabel');
  }

  getStats() {
    const statsCard = this.page.locator('div.TapsStats-stat');
    const totalEventsTitle = statsCard.filter({ hasText: 'Total events' });
    const totalEvents = totalEventsTitle.locator('span.TapsStats-value');
    const totalTapInsTitle = statsCard.filter({ hasText: 'Tap ins' });
    const totalTapIns = totalTapInsTitle.locator('span.TapsStats-value');
    const totalTapOutsTitle = statsCard.filter({ hasText: 'Tap outs' });
    const totalTapOuts = totalTapOutsTitle.locator('span.TapsStats-value');
    const declinedTitle = statsCard.filter({ hasText: 'Declined' });
    const declined = declinedTitle.locator('span.TapsStats-value');

    return {
      totalEventsTitle,
      totalEvents,
      totalTapInsTitle,
      totalTapIns,
      totalTapOutsTitle,
      totalTapOuts,
      declinedTitle,
      declined,
    };
  }

  async initEventSourceMock() {
    await this.page.addInitScript({
      path: path.join(__dirname, '../../tests/mocks/e2e/event-source.mock.js'),
    });
  }

  getSortedColumnData(sort: TableSort) {
    const data = mockData();
    const mapped = data.map((item) => {
      const { tap } = item;
      const { deviceName, event, eventId, status, timestamp } = tap;
      const formattedDate = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date(timestamp));

      return { deviceName, event: TapEventLabelMap[event], eventId, status, timestamp: formattedDate } as TapTableRow;
    });

    return sortTapsResponseData(mapped, sort.column, sort.direction).map((row) => {
      return row[sort.column];
    });
  }

  getMappers() {
    const columnTestIdMap: Record<string, string> = {
      'Device Name': '[data-testid="taps-row-device-name"]',
      Timestamp: '[data-testid="taps-row-device-timestamp"]',
      Event: '[data-testid="taps-row-event"]',
      Status: '[data-testid="taps-row-status"]',
    };
    const propertyNameMap: Record<string, string> = {
      'Device Name': 'deviceName',
      Timestamp: 'timestamp',
      Event: 'event',
      Status: 'status',
    };

    return { columnTestIdMap, propertyNameMap };
  }
}

// Extend base test
export const test = base.extend<DashboardFixtures>({
  disconnectedDashboardPage: async ({ page }, use, testInfo) => {
    const apiURL = (testInfo.project.use as MyCustomOptions).apiURL;
    const dashboard = new DashboardPage(page, apiURL);

    await dashboard.initEventSourceMock();
    await page.goto('/');

    await use(dashboard);
  },

  liveDashboardPage: async ({ page }, use, testInfo) => {
    const apiURL = (testInfo.project.use as MyCustomOptions).apiURL;
    const dashboard = new DashboardPage(page, apiURL);

    await dashboard.initEventSourceMock();
    await mockServerSideEvents(`${apiURL}/taps`, page);
    await page.goto('/');

    await use(dashboard);
  },
});

export { expect };
