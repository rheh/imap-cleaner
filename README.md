# imap-cleaner
NodeJS command line utility for removing old emails from an IMAP server.

Usage:

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

``node index.js --deleteOlderThan 400 --max 20

