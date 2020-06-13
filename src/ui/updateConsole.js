const ora = require('ora');
const spinner = ora('Loading unicorns');

module.exports = function updateConsole(text) {
  if (!text) {
    spinner.stop();

    return;
  }

  if (spinner.isSpinning) {
    spinner.text = text;
    return;
  }

  spinner.start(text);
};
