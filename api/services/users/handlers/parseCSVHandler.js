const fs = require('fs');
const csv = require('csv-parser');
const ObjectsToCsv = require('objects-to-csv');
const papa = require('papaparse');
const validate = require('../../../../utils/helpers/validationHelper');
const Controller = require('../index');
const {
  createUserSchema,
} = require('../schema');

function parseCSVHandler(file) {
  console.log('parseCSVHandler -> file', file);

  const parseStream = papa.parse(papa.NODE_STREAM_INPUT, { header: true });

  const fileStream = fs.createReadStream(file);

  let count = 1;
  const usersWithErrors = [];

  parseStream.on('data', (row) => {
    count += 1;

    const user = {

      profile: {
        firstName: row.firstName,
        lastName: row.lastName,
        birthDate: Math.round((new Date(row.birthDate)).getTime() / 1000),
        phoneNumber: row.phoneNumber,
        gender: row.gender,
        country: row.country,
        documentId: row.documentId,
      },
      auth: {
        email: row.email,
        role: row.role.toLowerCase(),
      },
    };

    const error = validate(user, createUserSchema);
    if (error) {

      userError = { ...row, error: error.details[0].message };
      console.log('insertUsers -> error', `Line ${count} - ${error.details[0].message}`);
      usersWithErrors.push(userError);
    } else {
      Controller.insertUser(user)
        .then((results) => console.log('results', results));
    }

  });

  parseStream.on('finish', () => {
    const csv = new ObjectsToCsv(usersWithErrors);

    csv.toDisk('./temp/test.csv');
    fs.unlinkSync(file);
  });

  fileStream.pipe(parseStream);
}

module.exports = parseCSVHandler;
