const {isObject, isFunction} = require('lodash');

module.exports = function openInbox(imapConnection) {
  return new Promise((resolve, reject) => {
    if (!isObject(imapConnection)) {
      return reject(
          new Error('Invalid parameter: imapConnection object invalid')
      );
    }

    if (!isFunction(imapConnection.openBox)) {
      return reject(
          new Error('Invalid parameter: imapConnection object invalid')
      );
    }

    imapConnection.openBox('INBOX', false, (err, openedInbox) => {
      if (err) {
        return reject(new Error(`Failed to open inbox. Error: ${err}`));
      }

      return resolve({
        imapConnection,
        openedInbox,
      });
    });
  });
};
