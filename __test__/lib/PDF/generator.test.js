const fs = require('fs');
const generateDocument = require('../../../lib/PDF/generator');

const path = `${__dirname}/test.pdf`;

describe('Testing to generate pdf', () => {
  it('Should return true if file exists', async (done) => {
    const data = [
      {
        testId: '000000000000000000000003',
        testName: 'Prueba duplicada',
        doctorId: '000000000000000000000008',
        status: 'DONE',
      },
      {
        testId: '000000000000000000000003',
        testName: 'Prueba duplicada',
        doctorId: '000000000000000000000008',
        status: 'DONE',
      },
      {
        testId: 'e5-l2QGl_R0ZHeonwp5fU',
        testName: 'Análisis Sanguineo',
        doctorName: 'José Francisco',
        doctorId: '5e30b94546fc3f5c223c4254',
        status: 'UNDEFINED',
        updatedAt: 1589900537820,
        results: [Object],
      },
    ];

    const pdf = await generateDocument(data);
    fs.writeFile(path, pdf, async (err) => {
      if (err) {
        return console.log(err);
      }
      const file = await fs.existsSync(path);
      expect(file).toBe(true);
      await fs.unlink(path, (err) => {
        if (err) throw new Error('Something went wrong, please try again later');
        console.log('removed');
      });
    });

    done();
  }, 3000);
});
