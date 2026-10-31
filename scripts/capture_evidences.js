const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = '/home/chris/.gemini/antigravity-cli/brain/f57e1e94-fcd6-4068-ae8a-34a9c3350f24';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
    locale: 'es-ES'
  });

  const page = await context.newPage();

  console.log('Capturando Evidencia 1A: Lista de Issues...');
  await page.goto('https://github.com/ChriSHM29/practica-seguimiento-incidentes/issues?q=is%3Aissue', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'evidencia_1_lista_issues.png'), fullPage: false });

  console.log('Capturando Evidencia 1B: Etiquetas del Repositorio...');
  await page.goto('https://github.com/ChriSHM29/practica-seguimiento-incidentes/labels', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'evidencia_1b_etiquetas.png'), fullPage: false });

  console.log('Capturando Evidencia 2: Detalle de Issue 1 (Descripción, Assignee, Comentario de Prioridad)...');
  await page.goto('https://github.com/ChriSHM29/practica-seguimiento-incidentes/issues/1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'evidencia_2_issue_detalle.png'), fullPage: false });

  console.log('Capturando Evidencia 3: Pull Request con Closes #1 y estado Merged...');
  await page.goto('https://github.com/ChriSHM29/practica-seguimiento-incidentes/pull/6', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'evidencia_3_pull_request.png'), fullPage: false });

  console.log('Capturando Evidencia 4: Cierre Automático del Issue en Timeline...');
  await page.goto('https://github.com/ChriSHM29/practica-seguimiento-incidentes/issues/1', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    window.scrollBy(0, 600);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'evidencia_4_issue_cerrado_auto.png'), fullPage: false });

  await browser.close();
  console.log('Todas las capturas se guardaron exitosamente en el directorio de artefactos.');
}

run().catch(err => {
  console.error('Error al capturar evidencias:', err);
  process.exit(1);
});
