const fs = require('fs');
const ejs = require('ejs');
const pdf = require('html-pdf');

/**
 * Generate PDF from data passed as an argument and inject it in the HTML template to generate a PDF file.
 * @param data Object
 * @param path String
 * @return {PDF|true}
 */
async function generateDocument(data, path = '') {
  const compiled = ejs.compile(fs.readFileSync(`${__dirname}/templates/results.html`, 'utf8'));
  const html = compiled(data);

  if (path !== '') {
    await pdf.create(html).toFile(path, () => {
      return true;
    });
  }
  // eslint-disable-next-line no-return-await
  return await pdf.create(html);
}

module.exports = generateDocument;
