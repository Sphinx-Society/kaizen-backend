const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');

const compile = async function (templateName, data) {
  const filePath = `${__dirname}/templates/${templateName}.hbs`;
  const html = await fs.readFile(filePath, 'utf-8');
  return hbs.compile(html)(data);
};

/**
 * Return a buffer of pdf created.
 * @param data
 * @return {Promise<*>}
 */
module.exports = async (data) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    const content = await compile('results', data);
    await page.setContent(content);
    await page.emulateMedia('screen');
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });
    return pdf;
  } catch (e) {
    console.log(e);
  }
};
