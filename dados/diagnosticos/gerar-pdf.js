const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'diagnostico-joaomarketing-v2.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // Aguarda fontes carregarem
  await page.waitForTimeout(2000);

  await page.pdf({
    path: path.resolve(__dirname, 'diagnostico-joaomarketing-v2.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('PDF gerado com sucesso!');
})();
