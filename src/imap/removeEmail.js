const {isObject, has} = require('lodash');

module.exports = function removeEmail(imapConnection, email) {
  return new Promise((resolve, reject) => {
    if (!isObject(imapConnection)) {
      return reject(
          new Error('Invalid parameter: imapConnection object invalid')
      );
    }

    if (!isObject(email)) {
      return reject(
          new Error('Invalid parameter: email object invalid')
      );
    }

    if (!has(email, 'seqNo')) {
      return reject(
          new Error('Invalid parameter: email object invalid - missing seqNo property')
      );
    }

    imapConnection.seq.addFlags(email.seqNo, '\\Deleted', (err) => {
      err ? reject(err) : resolve('removed');
    });
  });
};
