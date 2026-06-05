import { expect, test } from '@playwright/test';

import { MyCustomOptions } from '../playwright.config';
import { getStatsValueLocators, mockServerSideEvents } from './utils';
import { mockTapEventsResponse } from '../tests/mocks/data';
import * as path from 'node:path';

test.describe('Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({
      path: path.join(__dirname, '../tests/mocks/e2e/event-source.mock.js'),
    });
  });

  test.describe('when the app is launched and no sse connection', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('has title', async ({ page }) => {
      await expect(page).toHaveTitle(/Transit Tap/);
    });

    test('has heading', async ({ page }) => {
      const heading = page.locator('h1.TapsListHeader-heading');

      await expect(heading).toBeVisible();
      await expect(heading).toHaveText('Transit Tap Event Stream');
    });

    test('has connection indicator when no sse connection', async ({ page }) => {
      const indicatorLabel = page.locator('span.TapsListHeader-liveIndicatorLabel');

      await expect(indicatorLabel).toBeVisible();
      await expect(indicatorLabel).toHaveText('Not connected');
    });

    test('should show no stats data', async ({ page }, testInfo) => {
      const { apiURL } = testInfo.project.use as MyCustomOptions;

      await page.route(`${apiURL}/taps`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/event-stream',
          headers: { 'Cache-Control': 'no-cache' },
        });
      });

      await page.goto('/');

      const { totalEventsValue, totalTapInsValue, totalTapOutsValue, declinedValue } =
        getStatsValueLocators(page);

      await expect(totalEventsValue).toHaveText('0');
      await expect(totalTapInsValue).toHaveText('0');
      await expect(totalTapOutsValue).toHaveText('0');
      await expect(declinedValue).toHaveText('0');
    });
  });

  test.describe('when an sse connection is established', () => {
    test('should show all the data when connection is success', async ({ page }, testInfo) => {
      const { apiURL } = testInfo.project.use as MyCustomOptions;

      await mockServerSideEvents(`${apiURL}/taps`, page, mockTapEventsResponse);
      await page.goto('/');

      const indicatorLabel = page.locator('span.TapsListHeader-liveIndicatorLabel');
      const { totalEventsValue, totalTapInsValue, totalTapOutsValue, declinedValue } =
        getStatsValueLocators(page);

      await expect(indicatorLabel).toHaveText('Live stream');
      await expect(totalEventsValue).toHaveText('4');
      await expect(totalTapInsValue).toHaveText('1');
      await expect(totalTapOutsValue).toHaveText('3');
      await expect(declinedValue).toHaveText('2');
    });
  });
});
