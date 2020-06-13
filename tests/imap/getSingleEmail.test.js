/* eslint-disable max-len */
const getSingleEmail = require('../../src/imap/getSingleEmail');
const _ = require('lodash');

jest.mock('../../src/utilities/logger');

const sequenceNumber = 1;
const fetchedMessage = {
  on: function(message, seqNo) {
  },
};

const imapFetchResult = {
  on: function(message, callback) {
    if (message === 'message') {
      callback(fetchedMessage, sequenceNumber);
    } else if (message === 'end') {
      callback(message);
    }
  },
};

const imapConnection = {
  fetch: function() {
    return imapFetchResult;
  },
};


const uid = '12121210291029';

test('When attempting to get an email with null imap connection', () => {
  expect(getSingleEmail(null)).rejects.toThrow('Invalid parameter: object containing Imap connection expected');
});

test('When attempting to get an email with undefined imap connection', () => {
  expect(getSingleEmail(undefined)).rejects.toThrow('Invalid parameter: object containing Imap connection expected');
});

test('When attempting to get an email with malformed imap connection', () => {
  expect(getSingleEmail(1212)).rejects.toThrow('Invalid parameter: object containing Imap connection expected');
});

test('When attempting to get an email with malformed imap connection', () => {
  expect(getSingleEmail({
    imapConnection: imapConnection,
  })).rejects.toThrow('Invalid parameter: string uid expected');
});

test('When attempting to get an email fetch is called in the imap object', () => {
  const spy = jest.spyOn(imapConnection, 'fetch');

  getSingleEmail(imapConnection, uid);

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});

test('When attempting to get an email function "on" is called three times', () => {
  const spy = jest.spyOn(imapFetchResult, 'on');

  getSingleEmail(imapConnection, uid);

  expect(spy).toHaveBeenCalledTimes(3);

  spy.mockRestore();
});

test('When attempting to get an email function fetchedMessage "on" is called three times', () => {
  const spy = jest.spyOn(fetchedMessage, 'on');

  getSingleEmail(imapConnection, uid);

  expect(spy).toHaveBeenCalledTimes(2);

  spy.mockRestore();
});

test('It gets an email object when successful', async () => {
  const result = await getSingleEmail(imapConnection, uid);

  expect(_.isObject(result)).toEqual(true);
});


test('It returns an email object with the subject property', async () => {
  const result = await getSingleEmail(imapConnection, uid);

  expect(_.has(result, 'subject')).toEqual(true);
});

test('It returns an email object with the seqNo property', async () => {
  const result = await getSingleEmail(imapConnection, uid);

  expect(_.has(result, 'seqNo')).toEqual(true);
});

test('It returns an email object with the uid property', async () => {
  const result = await getSingleEmail(imapConnection, uid);

  expect(_.has(result, 'uid')).toEqual(true);
});

test('It returns an email object with the correct subject property', async () => {
  const result = await getSingleEmail(imapConnection, uid);

  expect(_.get(result, 'subject')).toEqual('');
});

test('It returns an email object with the correct seqNo property', async () => {
  const result = await getSingleEmail(imapConnection, uid);

  expect(_.get(result, 'seqNo')).toEqual(1);
});

test('It returns an email object with the correct uid property', async () => {
  const result = await getSingleEmail(imapConnection, uid);

  expect(_.get(result, 'uid')).toEqual('12121210291029');
});
