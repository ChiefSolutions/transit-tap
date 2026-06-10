import { test, expect } from './dashboard-fixture';

test.describe('Dashboard Tests (No Connection)', () => {
  test('has title and layout headings', async ({ disconnectedDashboardPage }) => {
    await expect(disconnectedDashboardPage.page).toHaveTitle(/Transit Tap/);
    await expect(disconnectedDashboardPage.heading).toHaveText('Transit Tap Event Stream');
    await expect(disconnectedDashboardPage.indicatorLabel).toHaveText('Not connected');
  });

  test('should show zero stats data on empty stream', async ({ disconnectedDashboardPage }) => {
    const { totalEventsTitle, totalEvents, totalTapInsTitle, totalTapIns, totalTapOutsTitle, totalTapOuts, declinedTitle, declined } =
      disconnectedDashboardPage.getStats();

    await expect(totalEventsTitle).toBeVisible();
    await expect(totalEvents).toHaveText('0');
    await expect(totalTapInsTitle).toBeVisible();
    await expect(totalTapIns).toHaveText('0');
    await expect(totalTapOutsTitle).toBeVisible();
    await expect(totalTapOuts).toHaveText('0');
    await expect(declinedTitle).toBeVisible();
    await expect(declined).toHaveText('0');
  });

  test('should show the table with no data', async ({ disconnectedDashboardPage }) => {
    await expect(disconnectedDashboardPage.tableComponent).toBeVisible();
    await expect(disconnectedDashboardPage.noDataMessage).toHaveText('No data to display at the moment.');
  });
});

test.describe('Dashboard Tests (Live Connection)', () => {
  test('should show metrics data when connection is successful', async ({ liveDashboardPage }) => {
    const { totalEvents, totalTapIns, totalTapOuts, declined } = liveDashboardPage.getStats();

    await expect(liveDashboardPage.indicatorLabel).toHaveText('Live stream');
    await expect(totalEvents).toHaveText('6');
    await expect(totalTapIns).toHaveText('3');
    await expect(totalTapOuts).toHaveText('3');
    await expect(declined).toHaveText('3');
  });

  test('should show sort indicators when columns are clicked', async ({ liveDashboardPage }, testInfo) => {
    const isHeadless = testInfo.project.use.headless;
    const columnNamesText = await liveDashboardPage.columnHeaders.allTextContents();
    const columnNames = columnNamesText.map((c) => c.trim());

    for (const column of columnNames) {
      const button = liveDashboardPage.columnHeaders.locator('button.TapsListTable-tableHeaderButton').filter({ hasText: column });

      await button.click();
      await expect(button.getByTestId('table-header-colum-sort-icon')).toHaveText('▲');

      await button.click({ delay: isHeadless ? 0 : 150 });
      await expect(button.getByTestId('table-header-colum-sort-icon')).toHaveText('▼');

      await button.click({ delay: isHeadless ? 0 : 150 });
      await expect(button.getByTestId('table-header-colum-sort-icon')).not.toBeVisible();
    }
  });

  test.describe('should sort table data in asc or desc order', async () => {
    const directions = ['asc', 'desc'] as const;

    for (const direction of directions) {
      test(`should sort table data in ${direction} when columns are clicked`, async ({ liveDashboardPage }, testInfo) => {
        const columnNamesText = await liveDashboardPage.columnHeaders.allTextContents();
        const columnNames = columnNamesText.map((c) => c.trim());
        const { columnTestIdMap, propertyNameMap } = liveDashboardPage.getMappers();

        // Iterate through columns
        for (const column of columnNames) {
          await test.step(`Testing column: ${column}`, async () => {
            const button = liveDashboardPage.columnHeaders.locator('button.TapsListTable-tableHeaderButton').filter({ hasText: column });

            // Sort execution
            await button.click();

            if (direction === 'desc') {
              const isHeadless = testInfo.project.use.headless;
              await button.click({ delay: isHeadless ? 0 : 150 });
            }

            // Assertions using .soft so all dynamic columns get tested
            const expectedIcon = direction === 'asc' ? '▲' : '▼';
            await expect.soft(button.getByTestId('table-header-colum-sort-icon')).toHaveText(expectedIcon);

            const columnElements = liveDashboardPage.page.locator(columnTestIdMap[column]);
            const columnValueText = await columnElements.allTextContents();
            const result = columnValueText.map((name) => name.trim().replace(/\u202F/g, ' '));

            const expectedSortedData = liveDashboardPage.getSortedColumnData({
              column: propertyNameMap[column],
              direction,
            });

            expect.soft(result).toEqual(expectedSortedData);
          });
        }
      });
    }
  });
});
