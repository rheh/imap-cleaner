const imapFactory = require('./src/imap/imapFactory');
const openInbox = require('./src/imap/openInbox');
const searchInbox = require('./src/imap/searchInbox');
const closeConnection = require('./src/imap/closeConnection');
const loadEmails = require('./src/imap/loadEmails');
const removeEmails = require('./src/imap/removeEmails');
const challengeUser = require('./src/ui/challengeUser');
const updateConsole = require('./src/ui/updateConsole');
const configReader = require('./src/config/reader');

const logger = require('./src/utilities/logger');
const argv = require('yargs').argv;

if (!argv.deleteOlderThan || argv.deleteOlderThan <= 0) {
  logger('imap-cleaner --deleteOlderThan <number of days old>');
  process.exit(1);
}

const days = argv.days || 389;
const max = argv.max || undefined;
const config = configReader();

imapFactory(config)
    .then(openInbox)
    .then(searchInbox.bind(null, days, max, updateConsole))
    .then(challengeUser.bind(null, max, updateConsole))
    .then(loadEmails.bind(null, updateConsole))
    .then(removeEmails.bind(null, updateConsole))
    .then(closeConnection.bind(null, updateConsole))
    .then(() => {
      updateConsole(null);
      process.exit(0);
    })
    .catch((error) => {
      logger(error.message || error);
      updateConsole(null);
      process.exit(1);
    });
