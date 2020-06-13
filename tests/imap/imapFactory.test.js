/* eslint-disable max-len */
const imapFactory = require('../../src/imap/imapFactory');
const _ = require('lodash');

const mockOnce = jest.fn();
const mockConnect = jest.fn();

jest.mock('../../src/utilities/logger');

jest.mock('imap', () => {
  return function() {
    return {
      once: mockOnce,
      connect: mockConnect,
    };
  };
});

beforeEach(() => {
  mockOnce.mockClear();
  mockConnect.mockClear();
});

test('It rejects attempt to create an email connection no options passed', () => {
  expect(imapFactory()).rejects.toThrow('Invalid parameter: object containing Imap connection options expected');
});

test('It rejects attempt to create an email connection null instead of options object', () => {
  expect(imapFactory(null)).rejects.toThrow('Invalid parameter: object containing Imap connection options expected');
});

test('It rejects attempt to create an email connection malformed data instead of options object', () => {
  expect(imapFactory('dssdsdsd')).rejects.toThrow('Invalid parameter: object containing Imap connection options expected');
});


test('It calls connect on imap', () => {
  imapFactory({});

  expect(mockConnect).toHaveBeenCalledTimes(1);
});

test('It calls once on imap', () => {
  imapFactory({});

  expect(mockOnce).toHaveBeenCalledTimes(3);
});

test('It throws when connection fails', async () => {
  mockOnce.mockImplementation(function(message, callback) {
    if (message === 'error') {
      callback('Failed to open connection');
    }
  });

  await expect(imapFactory({})).rejects.toThrow('Failed to open connection');

  mockOnce.mockRestore();
});

test('It resolves when connection fails', async () => {
  mockOnce.mockImplementation(function(message, callback) {
    if (message === 'ready') {
      callback();
    }
  });

  const result = await imapFactory({});

  expect(_.isObject(result)).toEqual(true);
});


