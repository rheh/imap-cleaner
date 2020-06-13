const {includes} = require('lodash');
const prompts = require('prompts');

const noOptions = ['N', 'n', 'No', 'Nope', 'Nine'];
const yesOptions = ['Y', 'y', 'Yes', 'Yo', 'Oui'];
const allOptions = noOptions.concat(yesOptions);

module.exports = async function challengeUser(max, updateConsole, payload) {
  const emails = payload.results;

  if (!emails || emails.length === 0) {
    return [];
  }

  updateConsole(null);

  let message = `${payload.total} emails found.`;

  if (max) {
    message += ` Limiting removal to ${max}.`;
  }

  const response = await prompts({
    type: 'text',
    name: 'confirm',
    message: `${message}  Remove? (Y/N)`,
    validate: (confirm) => includes(allOptions, confirm) ? true : 'Y or N',
  });

  if (!response.confirm || includes(noOptions, response.confirm)) {
    throw new Error('Cancelled by user');
  }

  return payload;
};
