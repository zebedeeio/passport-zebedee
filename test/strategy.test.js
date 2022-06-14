/* global describe, it, expect */
/* jshint expr: true */

var ZebedeeStrategy = require('../lib/strategy')
  , chai = require('chai');


describe('Strategy', function() {
  
  describe('constructed', function() {
    var strategy = new ZebedeeStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function() {});
    
    it('should be named zebedee', function() {
      expect(strategy.name).to.equal('zebedee');
    });
  })
  
  describe('constructed with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new ZebedeeStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  })
  
  describe('authorization request with documented parameters', function() {
    var strategy = new ZebedeeStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function() {});
    
    
    var url;
  
    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate();
    });
  
    it('should be redirected', function() {
      expect(url).to.equal('https://zebedee.io/v0/oauth/authorize?response_type=code&client_id=ABC123');
    });
  }); // authorization request with documented parameters
  
  describe('authorization request with incremental authorization parameters', function() {
    var strategy = new ZebedeeStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function() {});
    
    
    var url;
  
    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate({ scope: [ 'user' ], includeGrantedScopes: true });
    });
  
    it('should be redirected', function() {
      expect(url).to.equal('https://zebedee.io/v0/oauth/authorize?response_type=code&scope=user&client_id=ABC123');
    });
  }); // authorization request with incremental authorization parameters
  
  describe('authorization request with undocumented parameters', function() {
    var strategy = new ZebedeeStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function() {});
    
    
    var url;
  
    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate();
    });
  
    it('should be redirected', function() {
      expect(url).to.equal('https://zebedee.io/v0/oauth/authorize?response_type=code&client_id=ABC123');
    });
  }); // authorization request with undocumented parameters
  
});