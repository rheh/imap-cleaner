/* eslint-disable max-len */
const removeEmails = require('../../src/imap/removeEmails');

jest.useFakeTimers();

jest.mock('../../src/utilities/logger');

const updateConsole = function() {};

beforeEach(() => {
});

test('It rejects attempt to remove emails when imap connectionn object is not passed', () => {
  expect(removeEmails(updateConsole, {
    emailsToDelete: [],
  })).rejects.toThrow('Invalid parameter: imapConnection object invalid');
});

test('It rejects attempt to remove emails when array of emails is not passed', () => {
  expect(removeEmails(updateConsole, {
    imapConnection: {},
  })).rejects.toThrow('Invalid parameter: emailsToDelete object invalid');
});

test('It rejects attempt to remove emails when imap connectionn object is null', () => {
  expect(removeEmails(updateConsole, {
    imapConnection: null,
    emailsToDelete: [],
  })).rejects.toThrow('Invalid parameter: imapConnection object invalid');
});

test('It rejects attempt to remove emails when array of emails is null', () => {
  expect(removeEmails(updateConsole, {
    imapConnection: {},
    emailsToDelete: null,
  })).rejects.toThrow('Invalid parameter: emailsToDelete object invalid');
});

test('It rejects attempt to remove emails when imap connectionn object is undefined', () => {
  expect(removeEmails(updateConsole, {
    imapConnection: undefined,
    emailsToDelete: [],
  })).rejects.toThrow('Invalid parameter: imapConnection object invalid');
});

test('It rejects attempt to remove emails when array of emails is undefined', () => {
  expect(removeEmails(updateConsole, {
    imapConnection: {},
    emailsToDelete: undefined,
  })).rejects.toThrow('Invalid parameter: emailsToDelete object invalid');
});

test('It rejects attempt to remove emails when imap connectionn object is malformed', () => {
  expect(removeEmails(updateConsole, {
    imapConnection: 12,
    emailsToDelete: [],
  })).rejects.toThrow('Invalid parameter: imapConnection object invalid');
});

test('It rejects attempt to remove emails when array of emails is malformed', () => {
  expect(removeEmails(updateConsole, {
    imapConnection: {},
    emailsToDelete: 'hello',
  })).rejects.toThrow('Invalid parameter: emailsToDelete object invalid');
});


test('It returns an empty array when nothing to delete', async () => {
  const result = await removeEmails(updateConsole, {
    imapConnection: {},
    emailsToDelete: [],
  });

  expect(result.emailsToDelete.length).toBe(0);
});
