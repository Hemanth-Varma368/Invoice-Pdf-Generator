const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Navigate to your local server
    await page.goto('http://localhost:8000/', {
      waitUntil: 'networkidle0' // Wait for all network requests to finish
    });

    // OPTIONAL: If you're sure your .pdf container exists, keep this.
    // Otherwise, remove or update the selector.
    const pdfSelector = '.pdf';
    const selectorExists = await page.$(pdfSelector);

    if (selectorExists) {
      await page.waitForSelector(pdfSelector); // Wait until .pdf appears
    } else {
      console.warn(`Warning: Selector "${pdfSelector}" not found. Skipping wait.`);
    }

    // Generate PDF
    await page.pdf({
      path: 'invoice.pdf',
      format: 'A4',
      printBackground: true
    });

    console.log('PDF Generated: invoice.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await browser.close();
  }
})();
