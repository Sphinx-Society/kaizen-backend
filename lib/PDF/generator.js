const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');

const compile = async function (templateName, data) {
  dataObject = { ...data, img: 'https://kaizen-medical.s3.amazonaws.com/assets/kaizen-icon.png' };
  const filePath = `${__dirname}/templates/${templateName}.hbs`;
  const html = await fs.readFile(filePath, 'utf-8');
  return hbs.compile(html)(dataObject);
};

hbs.registerHelper('json', (context) => {
  return JSON.stringify(context);
});

hbs.registerHelper('check', (value, comparator) => {
  return (value === comparator) ? '-' : value;
});

hbs.registerHelper('date', (value) => {
  const date = new Date(value * 1000).toLocaleDateString();
  return date;
});

hbs.registerHelper('dateTime', (value) => {
  const date = new Date(value * 1000).toLocaleString();
  return date;
});

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
    browser.close();
    return pdf;
  } catch (error) {
    throw new Error(error);
  }
};
