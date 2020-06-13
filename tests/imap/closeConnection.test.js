/* eslint-disable max-len */
const closeConnection = require('../../src/imap/closeConnection');
const _ = require('lodash');

jest.mock('../../src/utilities/logger');

test('When attempting to close a connection that has undefined payload', () => {
  expect(closeConnection(_.noop, undefined)).rejects.toThrow('Invalid parameter: object containing Imap connection expected');
});

test('When attempting to close a connection that has null payload', () => {
  expect(closeConnection(_.noop, undefined)).rejects.toThrow('Invalid parameter: object containing Imap connection expected');
});

test('When attempting to close a connection that has malformed payload', () => {
  expect(closeConnection(_.noop, 12121)).rejects.toThrow('Invalid parameter: object containing Imap connection expected');
});

test('When attempting to close a connection that has missing connection object', () => {
  expect(closeConnection(_.noop, {})).rejects.toThrow('Invalid parameter: imapConnection object invalid');
});

test('When attempting to close a connection the closeInbox function is called', () => {
  const imapConnection = {
    closeBox: function(expunge, callback) {
      callback();
    },
    end: function() {
    },
  };

  const spy = jest.spyOn(imapConnection, 'closeBox');

  closeConnection(_.noop, {
    imapConnection: imapConnection,
  });

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});

test('When attempting to close a connection and it fails the error is passed to reject', async () => {
  const imapConnection = {
    closeBox: function(expunge, callback) {
      callback({
        message: 'An error occured',
      });
    },
    end: function() {
    },
  };

  await expect(closeConnection(_.noop, {
    imapConnection: imapConnection,
  })).rejects.toThrow('An error occured');
});

test('When attempting to close a connection the end function is called', async () => {
  const imapConnection = {
    closeBox: function(expunge, callback) {
      callback();
    },
    end: function() {
    },
  };

  const spy = jest.spyOn(imapConnection, 'end');

  await closeConnection(_.noop, {
    imapConnection: imapConnection,
  });

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});
