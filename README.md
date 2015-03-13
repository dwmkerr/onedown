# onedown

For clues, a mode to ask a question on how it works (spoiler alert for answers)
Star clues

## Local Development

The following data must be exported to environment variables:

* `ONEDOWN_AUTH0_SECRET`: The Auth0 development app secret.
* `ONEDOWN_AUTH0_AUDIENCE`: The Auth0 development app audience.

Use the files in `scripts\environment` as a template to add these values to the environment.

The following components should be installed on a local development machine:

 * NodeJS & NPM
 * Bower
 * MongoDB

Run the server with:

```bash
cd server
nodemon --debug ./server.js
```

Now lint, test and livereload as you develop with:

```bash
gulp
```

Consider

 * Offline dev (no auth0)

Write Up

 * REST modelling