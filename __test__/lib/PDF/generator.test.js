const fs = require('fs');
const generateDocument = require('../../../lib/PDF/generator');

const path = './lib/PDF/data/result.pdf';

describe('Testing to generate pdf', () => {
  it('Should return true if file exists', async (done) => {
    const data = {
      title: 'Kaizen Medical Lab',
      text: 'This a test message',
    };

    try {
      await generateDocument(data, path);
      const file = await fs.existsSync(path);
      expect(file).toBe(true);
    } catch (err) {
      console.error(err);
    }
    done();
  }, 3000);
});
