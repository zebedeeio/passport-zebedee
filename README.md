# passport-zebedee

[Passport](https://www.passportjs.org/) strategy for authenticating with Zebedee.

This module lets you authenticate using Zebedee in your Node.js applications.
By plugging into Passport, Zebedee authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](https://github.com/senchalabs/connect#readme)-style middleware,
including [Express](https://expressjs.com/).

## Install

```sh
$ npm install passport-zabedee
```

## Usage

#### Register Application

The Zebedee strategy authenticates users using their Zebedee account.  Before your
application can make use of Zebedee's authentication system, you must first
[register](https://dashboard.zebedee.io/) your app to use
OAuth 2.0 with Zebedee APIs.  Once registered, a client ID and secret will be
issued which are used by Zebedee to identify your app.

#### Configure Strategy

The Zebedee authentication strategy authenticates users using a Zebedee account
and OAuth 2.0 tokens.  The client ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
Zebedee's profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```javascript
var ZebedeeStrategy = require('passport-zebedee').Strategy;

passport.use(new ZebedeeStrategy({
    clientID: ZEBEDEE_CLIENT_ID,
    clientSecret: ZEBEDEE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/zebedee/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ zebedeeId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Define Routes

Two routes are needed in order to allow users to log in with their Zebedee
account.  The first route redirects the user to Zebedee, where they will
authenticate:

```js
app.get('/login/zebedee',
  passport.authenticate('zebedee', { scope: ['user'] }));
```

The second route processes the authentication response and logs the user in,
after Zebedee redirects the user back to the app:

```js
app.get('/oauth2/redirect/zebedee',
  passport.authenticate('zebedee', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
  });
```

## Examples

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2022 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

Copyright (c) 2021-2022 Zebedee, Inc <[http://zebedee.io/](http://zebedee.io/)>
