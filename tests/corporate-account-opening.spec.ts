import { expect, test, type Page } from '@playwright/test';

const testFile = {
  name: 'corporate-test-document.png',
  mimeType: 'image/png',
  buffer: Buffer.from('corporate account opening test file'),
};

async function fillCurrentStep(page: Page) {
  let previousFieldCount = -1;

  // Selecting the first available choice may reveal dependent fields. Repeat until
  // every newly rendered text/select control has also been populated.
  while (previousFieldCount !== await page.locator('input:not([type="file"]):not([type="checkbox"]), textarea, select').count()) {
    previousFieldCount = await page.locator('input:not([type="file"]):not([type="checkbox"]), textarea, select').count();

    const textFields = page.locator('input:not([type="file"]):not([type="checkbox"]), textarea');
    for (let index = 0; index < await textFields.count(); index += 1) {
      const field = textFields.nth(index);
      const type = await field.getAttribute('type');
      const name = (await field.getAttribute('name')) ?? `field-${index}`;
      await field.fill(
        type === 'date' ? '2026-08-17'
          : type === 'email' ? `test-${name}@example.com`
            : type === 'number' ? '100000'
              : type === 'tel' ? '08012345678'
                : type === 'url' ? 'https://example.com'
                  : `Corporate test ${name}`,
      );
    }

    const selects = page.locator('select');
    for (let index = 0; index < await selects.count(); index += 1) {
      const select = selects.nth(index);
      if (await select.inputValue()) continue;
      const value = await select.locator('option').evaluateAll((options) =>
        options.map((option) => option.value).find(Boolean),
      );
      if (value) await select.selectOption(value);
    }
  }

  const checkboxes = page.locator('input[type="checkbox"]');
  for (let index = 0; index < await checkboxes.count(); index += 1) {
    await checkboxes.nth(index).check();
  }

  const fileInputs = page.locator('input[type="file"]');
  for (let index = 0; index < await fileInputs.count(); index += 1) {
    await fileInputs.nth(index).setInputFiles(testFile);
  }
}

test('fills every field in the corporate account form and submits it', async ({ page }) => {
  test.setTimeout(120_000);
  const sendRealEmail = process.env.SEND_REAL_EMAIL === 'true';
  let corporateSubmissionReceived = false;
  const submissionAlerts: string[] = [];

  page.on('dialog', async (dialog) => {
    submissionAlerts.push(dialog.message());
    await dialog.dismiss();
  });

  if (!sendRealEmail) {
    await page.route('**/api/submit-form', async (route) => {
      corporateSubmissionReceived = route.request().method() === 'POST'
        && route.request().postDataBuffer()?.includes(Buffer.from('formType')) === true
        && route.request().postDataBuffer()?.includes(Buffer.from('corporate')) === true;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
  }

  await page.goto('/cooperate-account-opening');

  for (let step = 1; step <= 9; step += 1) {
    await fillCurrentStep(page);

    if (step === 9) {
      const downloadLink = page.getByRole('link', { name: 'Download Reference Form Template' });
      await expect(downloadLink).toHaveAttribute('href', '/Referee_Form.pdf');
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        downloadLink.click(),
      ]);
      expect(download.suggestedFilename()).toBe('Referee_Form.pdf');
    }

    if (step < 9) {
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(page.getByText(`Step ${step + 1} of 9`)).toBeVisible();
    }
  }

  const submissionResponse = page.waitForResponse((response) =>
    response.url().includes('/api/submit-form') && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Submit Application' }).click();
  const response = await submissionResponse;
  const responseBody = await response.json().catch(() => ({}));

  expect(response.status(), `Submission failed: ${JSON.stringify(responseBody)}`).toBe(200);
  expect(submissionAlerts, `Submission alert: ${submissionAlerts.join(' | ')}`).toEqual([]);
  await expect(page.getByRole('heading', { name: 'Application Submitted' })).toBeVisible({ timeout: 30_000 });
  expect(sendRealEmail || corporateSubmissionReceived).toBe(true);
});
