/* eslint-disable max-len */
const loadEmails = require('../../src/imap/loadEmails');
const _ = require('lodash');

jest.useFakeTimers();

jest.mock('../../src/utilities/logger');

beforeEach(() => {
});

test('It rejects attempt to load emails when no payload passed', () => {
  expect(loadEmails()).rejects.toThrow('Invalid parameter: object containing Imap connection and emails array expected');
});

test('It rejects attempt to load emails when null payload passed', () => {
  expect(loadEmails(null)).rejects.toThrow('Invalid parameter: object containing Imap connection and emails array expected');
});

test('It rejects attempt to load emails when malformed payload passed', () => {
  expect(loadEmails({})).rejects.toThrow('Invalid parameter: object containing Imap connection and emails array expected');
});

test('It return success (payload) when passed empty email array', async () => {
  const result = await loadEmails(_.noop, {
    results: [],
  });

  expect(_.isObject(result)).toEqual(true);
});

