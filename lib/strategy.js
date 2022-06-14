// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , uri = require('url')
  , ZebedeeProfile = require('./profile/zebedee')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , ZebedeeAPIError = require('./errors/zebedeeapierror')
  , UserInfoError = require('./errors/userinfoerror');

/**
 * `Strategy` constructor.
 *
 * The Zebedee authentication strategy authenticates requests by delegating to
 * Zebedee using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Zebedee dashboard's client id
 *   - `clientSecret`  your Zebedee dashboard's client secret
 *   - `callbackURL`   URL to which Zebedee will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new ZebedeeStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/zebedee/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://zebedee.io/v0/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://zebedee.io/v0/oauth/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'zebedee';
  this._userProfileURL = options.userProfileURL || 'https://zebedee.io/v0/me';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Zebedee.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `zebedee`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this;
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;
    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }

      if (json && !json.success && json.message) {
        return done(new ZebedeeAPIError(json.message));
      }

      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }
    
    try {
      json = JSON.parse(body);
      if (json && (!json.success || !json.data)) {
        return done(new UserInfoError(json.data.message));
      } 
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }
    
    var profile = ZebedeeProfile.parse(json);
    
    profile.provider  = 'zebedee';
    profile._raw = body;
    profile._json = json;
    
    done(null, profile);
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
