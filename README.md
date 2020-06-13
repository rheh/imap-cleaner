# imap-cleaner
![Node.js CI](https://github.com/rheh/imap-cleaner/workflows/Node.js%20CI/badge.svg)

NodeJS command line utility for removing old emails from an IMAP server.


## Installing

`npm install imap-cleaner`

## Running

Usage: node index.js --deleteOlderThan <num> --max <num>

1) Update the config files with your IMAP server details (See ./config/connectio.js)

```
{
  "user": "<User name>",
  "password": "<Password>",
  "host": "<IMAP Server address>",
  "port": 993,
  "tls": true
}
```

2) Run the command, only consider the ones with a date/time older than 400 days.  Limit the remove to 20 (for speed and safety)

```
node index.js --deleteOlderThan 400 --max 20
```

## Contributors

One-man-band at the moment.  Contact me at twitter on @rayhammond, or, via my blog here http://geeksretreat.wordpress.com if you are interest in getting involved.

## License

MIT
