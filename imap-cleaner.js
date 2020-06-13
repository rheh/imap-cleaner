const imapFactory = require('./src/imap/imapFactory');
const openInbox = require('./src/imap/openInbox');
const searchInbox = require('./src/imap/searchInbox');
const closeConnection = require('./src/imap/closeConnection');
const loadEmails = require('./src/imap/loadEmails');
const removeEmails = require('./src/imap/removeEmails');
const challengeUser = require('./src/ui/challengeUser');
const updateConsole = require('./src/ui/updateConsole');

module.exports = function imapCleaner(config, days, max) {
  return imapFactory(config)
    .then(openInbox)
    .then(searchInbox.bind(null, days, max, updateConsole))
    .then(challengeUser.bind(null, max, updateConsole))
    .then(loadEmails.bind(null, updateConsole))
    .then(removeEmails.bind(null, updateConsole))
    .then(closeConnection.bind(null, updateConsole))
    .finally(() => {
      updateConsole(null);
    });
}