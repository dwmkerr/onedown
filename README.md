# onedown

Work in progress. An old project I was working on, the goal of which was:

1. Pull crosswords from disparate online sources
2. Push them into a centralised database
3. Allow users to work on them offline, syncing their progress as needed

This project will probably be archived in future as scraping crosswords would be copyright violation, so beyond a learning exercise on page scraping and data modeling for crosswords themselves, this project has no meaningful real-world use.

## To Update!

If I decide to work on this again:

1. Eliminate Gulp
2. Modularise the code a bit more
3. Use a more modern front-end stack

I have updated the `package.json` to eliminate vulnerabilities, but not tested recently. This is so that if someone clones this to play around at least they should get _safer_ code. It will still need to be tested to get it working again.

## Local Development

The following data can be exported to environment variables:

* `ONEDOWN_AUTH0_SECRET`: Required. The Auth0 development app secret.
* `ONEDOWN_LOGENTRIES_TOKEN`: Optional. A logentries token.

Use the files in `scripts\environment` as a template to add these values to the environment.

The following components should be installed on a local development machine:

 * NodeJS & NPM
 * Bower
 * MongoDB

Run the server with:

```bash
node-inspector
nodemon --debug --watch ./server ./app.js
```

Now lint, test and livereload as you develop with:

```bash
gulp
```

## Production

Run the entire application with:

```bash
npm start
```

Consider

 * Offline dev (no auth0)

Write Up

 * REST modelling
