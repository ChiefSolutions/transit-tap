import { Page } from '@playwright/test';
import data from '../../tests/data/data.json';

const events = data.taps;
export const mockServerSideEvents = async (url: string, page: Page) => {
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

export const mockData = () => {
  return data.taps;
};
