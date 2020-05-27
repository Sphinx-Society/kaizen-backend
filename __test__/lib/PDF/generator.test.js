const fs = require('fs');
const generateDocument = require('../../../lib/PDF/generator');

const path = `${__dirname}/data/result.pdf`;

describe('Testing to generate pdf', () => {
  it('Should return true if file exists', async (done) => {
    const data = {
      testId: 'Kaizen Medical Lab',
      testName: 'This a test message',
      doctorName: 'Alejandro Cortez',
      doctorId: '1234567',
      status: 'active',
      updatedAt: Date.now(),
    };

    generateDocument(data, path);
    const file = await fs.existsSync(path);
    expect(file).toBe(true);
    done();
  }, 3000);
});
