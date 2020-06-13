/* eslint-disable max-len */
const openInbox = require('../../src/imap/openInbox');
const _ = require('lodash');

jest.useFakeTimers();

jest.mock('../../src/utilities/logger');

beforeEach(() => {
});

test('It rejects attempt to opem an inbox when imap connectionn object is not passed', () => {
  expect(openInbox()).rejects.toThrow('Invalid parameter: imapConnection object invalid');
});

test('It rejects attempt to opem an inbox when imap connectionn object is passed as null', () => {
  expect(openInbox(null)).rejects.toThrow('Invalid parameter: imapConnection object invalid');
});

test('It rejects attempt to opem an inbox when imap connectionn object is malformed', () => {
  expect(openInbox([])).rejects.toThrow('Invalid parameter: imapConnection object invalid');
});

test('It throws when failure to open inbox', async () => {
  const imapConnection = {
    openBox: function(inboxTitle, open, callback) {
      callback('broken');
    },
  };

  try {
    await openInbox(imapConnection);
  } catch (e) {
    expect(e.message).toMatch(`Failed to open inbox. Error: broken`);
  }
});

test('It returns the opened inbox when successfully opened', async () => {
  const imapConnection = {
    openBox: function(inboxTitle, open, callback) {
      callback(null, 'inbox');
    },
  };

  const result = await openInbox(imapConnection);

  expect(result.openedInbox).toEqual('inbox');
});

