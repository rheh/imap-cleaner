/* eslint-disable max-len */
const removeEmail = require('../../src/imap/removeEmail');

jest.useFakeTimers();

jest.mock('../../src/utilities/logger');

beforeEach(() => {
});

test('It rejects attempt to opem an inbox when imap connectionn object is not passed', () => {
  expect(removeEmail()).rejects.toThrow('Invalid parameter: imapConnection object invalid');
});

test('It rejects attempt to opem an inbox when imap connectionn object is passed as null', () => {
  expect(removeEmail(null)).rejects.toThrow('Invalid parameter: imapConnection object invalid');
});

test('It rejects attempt to opem an inbox when imap connectionn object is malformed', () => {
  expect(removeEmail([])).rejects.toThrow('Invalid parameter: email object invalid');
});

test('It throws when failure to remove email', async () => {
  const imapConnection = {
    seq: {
      addFlags: function(sequence, action, callback) {
        callback('cannot remove');
      },
    },
  };

  try {
    await removeEmail(imapConnection);
  } catch (e) {
    expect(e.message).toMatch(`Invalid parameter: email object invalid`);
  }
});

test('It returns failure when givenno email to remove', async () => {
  const imapConnection = {
    seq: {
      addFlags: function(sequence, action, callback) {
        callback(null);
      },
    },
  };

  try {
    await removeEmail(imapConnection);
  } catch (e) {
    expect(e.message).toMatch(`Invalid parameter: email object invalid`);
  }
});

test('It returns success when removed and email', async () => {
  const imapConnection = {
    seq: {
      addFlags: function(sequence, action, callback) {
        callback(null);
      },
    },
  };

  const email = {
    seqNo: 12,
  };

  const result = await removeEmail(imapConnection, email);

  expect(result).toEqual('removed');
});

