const { chromium } = require('playwright');
const path = require('path');

async function htmlToPdf(htmlPath, outputPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const absoluteHtmlPath = path.resolve(htmlPath).replace(/\\/g, '/');
  await page.goto(`file:///${absoluteHtmlPath}`, { waitUntil: 'networkidle' });

  // Aguarda fontes carregarem
  await page.waitForTimeout(2000);

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });

  await browser.close();
  console.log(`PDF gerado: ${outputPath}`);
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Uso: node html-to-pdf.js <caminho-html> <caminho-pdf>');
  process.exit(1);
}

htmlToPdf(args[0], args[1]).catch(err => {
  console.error('Erro ao gerar PDF:', err);
  process.exit(1);
});
