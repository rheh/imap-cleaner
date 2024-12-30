const moment = require('moment');

module.exports = function searchInbox(days, maxSize, updateConsole, payload) {
  return new Promise(async (resolve, reject) => {
    const {imapConnection} = payload;

    // Fetch emails from the last 24h
    const olderThanDateThreshold = moment().subtract(days, 'days');
    const targetIsoDate = olderThanDateThreshold.toISOString();

    updateConsole(`Searching for emails older than ${targetIsoDate}`);

    imapConnection.search([
      'SEEN', [
        'BEFORE', targetIsoDate,
      ],
    ], (err, emails) => {
      if (err) {
        return reject(err);
      }

      let message = `Found ${emails.length} emails`;

      if (maxSize) {
        message += ` limiting deletion to ${maxSize}`;
      }

      updateConsole(message);

      payload.results = maxSize ? emails.slice(0, maxSize): emails;
      payload.total = emails.length;

      resolve(payload);
    });
  });
};
