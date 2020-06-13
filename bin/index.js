#!/usr/bin/env node

const configReader = require('../src/config/reader');
const imapCleaner = require('../imap-cleaner');
const logger = require('../src/utilities/logger');

const argv = require('yargs').argv;

if (!argv.deleteOlderThan || argv.deleteOlderThan <= 0) {
  logger('imap-cleaner --deleteOlderThan <number of days old> [--max <max number to delete]');
  process.exit(1);
}

const days = argv.days || 389;
const max = argv.max || undefined;
const config = configReader();

imapCleaner(config, days, max)
  .then(() => {
      process.exit(0);
  })
  .catch((error) => {
      logger(error.message || error);
      process.exit(1);
  });