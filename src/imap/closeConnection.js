const {isObject, get} = require('lodash');

module.exports = function closeConnection(updateConsole, payload) {
  return new Promise((resolve, reject) => {
    if (!isObject(payload)) {
      return reject(
          new Error('Invalid parameter: object containing Imap connection expected')
      );
    }

    const imapConnection = get(payload, 'imapConnection');

    updateConsole('Closing inbox');

    if (!isObject(imapConnection)) {
      return reject(
          new Error('Invalid parameter: imapConnection object invalid')
      );
    }

    imapConnection.closeBox(true, (err) => {
      if (err) {
        return reject(new Error(err.message));
      }

      imapConnection.end();
      return resolve();
    });
  });
};
