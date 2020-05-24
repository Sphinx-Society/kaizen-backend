const fs = require('fs');
const ejs = require('ejs');
const pdf = require('html-pdf');

/**
 * Generate PDF from data passed as an argument and inject it in the HTML template to generate a PDF file.
 * @param {Object} data
 * @param  {String} path
 * @return {PDF|true}
 */
async function generateDocument(data, path = '') {
  const compiled = ejs.compile(fs.readFileSync(`${__dirname}/templates/results.html`, 'utf8'));
  const html = compiled(data);
  const fileExists = await fs.existsSync(path);

  if (path !== '' && !fileExists) {
    return createDocument(html, path);
  }

  if (path !== '' && fileExists) {
    removeDocument(path);
    return createDocument(html, path);
  }

  return html;
}

/**
 * Remove document from FS
 * @param {String} path
 */
function removeDocument(path) {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
}

/**
 * Create PDF document into path received in params
 * @param {String} content
 * @param {String} path
 */
function createDocument(content, path) {
  pdf.create(content)
    .toFile(path, () => {
      return true;
    });
}

module.exports = generateDocument;
