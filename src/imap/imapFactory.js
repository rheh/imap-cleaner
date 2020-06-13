const Imap = require('imap');
const Promise = require('bluebird');
const logger = require('../utilities/logger');
const {isObject, get} = require('lodash');

module.exports = function imapFactory(options) {
  if (!isObject(options)) {
    return Promise.reject(new Error('Invalid parameter: object containing Imap connection options expected'));
  }

  return new Promise((resolve, reject) => {
    const imapConnection = new Imap(options);

    imapConnection.once('ready', () => {
      return resolve(imapConnection);
    });

    imapConnection.once('error', (err) => {
      logger(err);

      return reject(new Error(get(err, 'message', err)));
    });

    imapConnection.once('end', () => {
      logger('Imap connection ended');
    });

    imapConnection.connect();
  });
};
