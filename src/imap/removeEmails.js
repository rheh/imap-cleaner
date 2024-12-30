const {map, isArray, isObject, get} = require('lodash');
const removeEmail = require('./removeEmail');
const logger = require('../utilities/logger');

module.exports = async function removeEmails(updateConsole, payload) {
  const emailsToDelete = get(payload, 'emailsToDelete');
  const imapConnection = get(payload, 'imapConnection');

  if (!isObject(imapConnection)) {
    return Promise.reject(
        new Error('Invalid parameter: imapConnection object invalid')
    );
  }

  if (!isArray(emailsToDelete)) {
    return Promise.reject(
        new Error('Invalid parameter: emailsToDelete object invalid')
    );
  }

  if (emailsToDelete.length === 0) {
    logger(`Nothing to delete...`);
    updateConsole(null);

    return payload;
  }

  const expected = emailsToDelete.length;
  let processed = 0;

  updateConsole(`Deleting ${processed + 1} o ${expected}`);

  const timer = setInterval(() => {
    updateConsole(`Deleting ${processed + 1} of ${expected}`);
  }, 200);

  await Promise.all(
      map(emailsToDelete, async (email) => {
        const removal = await removeEmail(imapConnection, email);
        processed++;

        return removal;
      })
  );

  clearTimeout(timer);
  updateConsole(null);

  return payload;
};
