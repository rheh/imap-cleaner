/* eslint-disable require-jsdoc */
const Imap = require('imap');
const {get} = require('lodash');
const {isObject, isString} = require('lodash');

function onBodyFetched(message, stream, info) {
  let body = '';

  stream.on('data', (data) => {
    body += data;
  });

  stream.on('end', () => {
    if (/^header/i.test(info.which)) {
      message.header = Imap.parseHeader(body);
    } else {
      message.body = body;
    }
  });
}

/**
 * @param {object} imapConnection Message object contain email details
 * @param {string} uid The UID of the message
 *
 * @return {Promise} Standard promise
 */
function getMessageByUid(imapConnection, uid) {
  return new Promise((resolve, reject) => {
    const imapFetchResult = imapConnection.fetch(uid, {
      bodies: [
        'HEADER.FIELDS (TO FROM SUBJECT)', 'TEXT',
      ],
    });

    let hadErr = false;

    const message = {
      header: undefined,
      body: '',
      attrs: undefined,
    };

    imapFetchResult.on('error', (err) => {
      hadErr = true;
      reject(err);
    });

    imapFetchResult.on('message', (fetchedMessage, seqno) => {
      message.seqno = seqno;

      fetchedMessage.on('body', onBodyFetched.bind(null, message));

      fetchedMessage.on('attributes', (attrs) => {
        message.attrs = attrs;
      });
    });

    imapFetchResult.on('end', () => {
      if (hadErr) {
        return reject(new Error(`Failed to fetch email body - uid ${uid}`));
      }

      resolve(message);
    });
  });
};

function buildEmailMessage(uid, email) {
  return {
    subject: get(email, 'header.subject', ''),
    seqNo: get(email, 'seqno', null),
    uid,
  };
}

function logError(error) {
  if (error) {
    console.log(error);
  }

  return false;
}

module.exports = function getSingleEmail(imapConnection, uid) {
  if (!isObject(imapConnection)) {
    return Promise.reject(
        new Error('Invalid parameter: object containing Imap connection expected')
    );
  }

  if (!isString(uid) && !isFinite(uid)) {
    return Promise.reject(
        new Error(`Invalid parameter: string uid expected, got ${uid}`)
    );
  }

  return getMessageByUid(imapConnection, uid)
      .then(buildEmailMessage.bind(null, uid))
      .catch(logError);
};
