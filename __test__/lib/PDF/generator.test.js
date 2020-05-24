const fs = require('fs');
const generateDocument = require('../../../lib/PDF/generator');

const path = './lib/PDF/data/result.pdf';

describe('Testing to generate pdf', () => {
  it('Should return true if file exists', async (done) => {
    const data = {
      title: 'Kaizen Medical Lab',
      text: 'This a test message',
    };

    generateDocument(data, path);
    const file = await fs.existsSync(path);
    expect(file).toBe(true);
    done();
  }, 3000);
});
