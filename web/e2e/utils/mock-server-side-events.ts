import { Page } from '@playwright/test';
import { TapResponse } from '../../src/app/taps/models';

export const mockServerSideEvents = async (url: string, page: Page, events: TapResponse[]) => {
  await page.route(url, async (route) => {
    const body = events.map((ev) => `data: ${JSON.stringify(ev)}\n\n`).join('');

    await route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    });
  });
};
