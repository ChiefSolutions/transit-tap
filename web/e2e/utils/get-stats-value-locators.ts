import { Page } from '@playwright/test';

export const getStatsValueLocators = (page: Page) => {
  const statsCard = page.locator('div.TapsStats-stat');
  const totalEventsCard = statsCard.filter({ hasText: 'Total events' });
  const totalEventsValue = totalEventsCard.locator('span.TapsStats-value');
  const totalTapInsCard = statsCard.filter({ hasText: 'Tap ins' });
  const totalTapInsValue = totalTapInsCard.locator('span.TapsStats-value');
  const totalTapOutsCard = statsCard.filter({ hasText: 'Tap outs' });
  const totalTapOutsValue = totalTapOutsCard.locator('span.TapsStats-value');
  const declinedCard = statsCard.filter({ hasText: 'Declined' });
  const declinedValue = declinedCard.locator('span.TapsStats-value');

  return { totalEventsValue, totalTapInsValue, totalTapOutsValue, declinedValue };
};
