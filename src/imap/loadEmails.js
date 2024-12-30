const {isObject, map, get} = require('lodash');
const getSingleEmail = require('./getSingleEmail');
const logger = require('../utilities/logger');

module.exports = async function loadEmails(updateConsole, payload) {
  if (!isObject(payload)) {
    return Promise.reject(
        new Error('Invalid parameter: object containing Imap connection and emails array expected')
    );
  }

  const messages = get(payload, 'results', []);
  const imapConnection = get(payload, 'imapConnection');

  if (!messages || messages.length === 0) {
    logger(`Nothing to delete...`);
    updateConsole(null);

    return Promise.resolve(payload);
  }

  const expected = messages.length;
  let processed = 0;

  updateConsole(`Loading ${processed + 1} or ${expected}`);

  const timer = setInterval(() => {
    updateConsole(`Loading ${processed + 1} or ${expected}`);
  }, 200);

  const emailsToDelete = await Promise.all(
      map(messages, async (uid) => {
        const retrieval = await getSingleEmail(imapConnection, uid);
        processed++;

        return retrieval;
      })
  );

  clearTimeout(timer);
  updateConsole(null);

  payload.emailsToDelete = emailsToDelete;

  return payload;
};
