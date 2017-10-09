const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('request');
const rp = require('request-promise');
const config = process.env.DATABASE_URL ? require('../db/config.heroku.js') : require('../db/config.js'); //Define PostgreSQL environment configuration here
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);
const models = require('../db/models');
const initFixtures = require('./fixtures')

const PORT = process.env.PORT || 3000;

/*  Make sure that the server is running before starting the tests  */
describe('Sound Connect API:', function() {
  beforeEach(function(done) { //Initialize fixtures
    initFixtures().then(() => done());
  });

  describe('GET /', function() {
    it('should return an html file', function(done) {
      rp({
        method: 'GET',
        uri: `http://localhost:${PORT}/`,
      })
      .then((results) => {
        expect(results.includes('<!DOCTYPE html>')).to.equal(true);
        done();
      });
    });
  });

  describe('GET /user/:username', function() {
    it('should return user and profile associated with the user', function(done) {
      rp({
        method: 'GET',
        uri: `http://localhost:${PORT}/user/Austin`,
        json: true
      })
      .then((results) => {
        expect(results.user.id).to.equal(1);
        expect(results.user.username).to.equal('Austin');
        expect(results.profile.user_id).to.equal(1);
        expect(results.profile.bio).to.equal("Austin's bio");
        done()
      });
    });
  });

  describe('GET /forum', function() {
    it('should return an array of thread objects', function(done) {
      request({
        method: 'GET',
        uri: `http://localhost:${PORT}/forum`
      }, (err, res, body) => {
        body = JSON.parse(body);
        expect(body.length).to.equal(10);
        expect(body[0]).to.be.a('object');
        expect(body[0].title).to.equal("Austin's thread");
        done();
      });
    });
  });

  describe('GET /forum/:threadId/posts', function() {
    it('should return an array of post objects that belong to the given thread', function(done) {
      rp({
        method: 'GET',
        uri: `http://localhost:${PORT}/forum/1/posts`,
        json: true
      })
      .then((results) => {
        expect(results).to.be.a('array');
        expect(results[0].thread_id).to.equal(1);
        expect(results[0].message).to.equal('Evan\'s message');
        done();
      });
    });
  });

  describe('GET /forum/:threadId/posts/:postId', function() {
    it('should return the specified post object in the given thread', function(done) {
      rp({
        method: 'GET',
        uri: `http://localhost:${PORT}/forum/1/posts/1`,
        json: true
      })
      .then((results) => {
        expect(results.id).to.equal(1);
        expect(results.message).to.equal('Evan\'s message');
        done();
      });
    });
  });

  describe('POST /login', function() {
    it('should login and return user id when correct username and password are supplied', function(done) {
      rp({
        method: 'POST',
        uri: `http://localhost:${PORT}/login`,
        json: {
          username: 'Austin',
          password: 'Austin'
        }
      })
      .then((results) => {
        expect(results.id).to.equal(1);
        done();
      });
    });

    it('should not login when incorrect username and password are supplied', function(done) {
      rp({
        method: 'POST',
        uri: `http://localhost:${PORT}/login`,
        json: {
          username: 'Fake user',
          password: 'Fake password'
        }
      })
      .catch((err) => {
        expect(err.statusCode).to.equal(401);
        done();
      });
    });

    it('should return a cookie upon a sccessful login', function(done) {
      let cookieJar = rp.jar();
      rp({
        method: 'POST',
        uri: `http://localhost:${PORT}/login`,
        json: {
          username: 'Austin',
          password: 'Austin'
        },
        jar: cookieJar
      })
      .then(() => {
        expect(cookieJar.getCookies(`http://localhost:${PORT}/`).length).to.equal(1);
        done();
      });
    });

    it('should insert new session into sessions table', function(done) {
      rp({
        method: 'POST',
        uri: `http://localhost:${PORT}/login`,
        json: {
          username: 'Austin',
          password: 'Austin'
        }
      })
      .then((results) => {
        return knex.raw('SELECT * FROM sessions');
      })
      .then((results) => {
        expect(results.rows.length).to.equal(1);
        done();
      });
    });
  });

  describe('POST /logout', function() {
    it('should delete a session from sessions table', function(done) {
      let cookieJar = rp.jar();
      rp({
        method: 'POST',
        uri: `http://localhost:${PORT}/login`,
        json: {
          username: 'Austin',
          password: 'Austin'
        },
        jar: cookieJar
      })
      .then(() => knex.raw('SELECT * FROM sessions'))
      .then((results) => {
        expect(results.rows.length).to.equal(1);
        return rp({
          method: 'POST',
          uri: `http://localhost:${PORT}/logout`,
          jar: cookieJar
        })
      })
      .then(() => knex.raw('SELECT * FROM sessions'))
      .then((results) => {
        expect(results.rows.length).to.equal(0);
        done()
      });
    });
  });

  describe('POST /signup', function() {
    it('should insert the new user into users table', function(done) {
      rp({
        method: 'POST',
        uri: `http://localhost:${PORT}/signup`,
        json: {
          username: 'New user',
          password: 'New user\'s password',
          profile: 'composer'
        }
      })
      .then(() => models.User.byUsername('New user'))
      .then((results) => {
        expect(results.attributes.password).to.equal('New user\'s password');
        done();
      });
    });

    it('should return a cookie upon a sccessful signup', function(done) {
      let cookieJar = rp.jar();
      rp({
        method: 'POST',
        uri: `http://localhost:${PORT}/signup`,
        json: {
          username: 'New user',
          password: 'New user\'s password',
          profile: 'composer'
        },
        jar: cookieJar
      })
      .then(() => {
        expect(cookieJar.getCookies(`http://localhost:${PORT}/`).length).to.equal(1);
        done();
      });
    });

    it('should insert a new session into sessions table', function(done) {
      rp({
        method: 'POST',
        uri: `http://localhost:${PORT}/signup`,
        json: {
          username: 'New user',
          password: 'New user\'s password',
          profile: 'composer'
        }
      })
      .then(() => knex.raw('SELECT * FROM sessions'))
      .then((results) => {
        expect(results.rows.length).to.equal(1);
        done()
      });
    });
  });

  describe('POST /forum', function() {
    it('should insert a thread into threads table', function(done) {
      rp({
        method: 'POST',
        uri: `http://localhost:${PORT}/forum`,
        json: {
          user_id: 1,
          title: 'A dummy thread made by userId 1',
          description: 'A description for dummy thread made by userId 1',
          instruments: JSON.stringify(['Piano', 'Violin']),
          musicsheet: 'example.jpg'
        }
      })
      .then(() => {
        return models.Thread.query('where', 'title', '=', 'A dummy thread made by userId 1').fetch();
      })
      .then((results) => {
        expect(results.attributes).to.be.a('object');
        expect(results.attributes.user_id).to.be.equal(1);
        expect(results.attributes.description).to.equal('A description for dummy thread made by userId 1');
        done()
      });
    });
  });

  describe('POST /forum/:threadId/posts', function() {
    it('should insert a post into posts table', function(done) {
      rp({
        method: 'POST',
        uri: `http://localhost:${PORT}/forum/1/posts`,
        json: {
          user_id: 11,
          message: 'test post'
        }
      })
      .then(() => models.Post.query('where', 'message', '=', 'test post').fetch())
      .then((results) => {
        expect(results.attributes.user_id).to.be.equal(11);
        expect(results.attributes.thread_id).to.be.equal(1);
        done()
      });
    });
  });

  describe('DELETE /forum/:threadId/posts/:postId', function() {
    it('should delete the specified post from posts table', function(done) {
      rp({
        method: 'DELETE',
        uri: `http://localhost:${PORT}/forum/1/posts/1`
      })
      .then(() => models.Post.query('where', 'id', '=', '1').fetch())
      .then((results) => {
        console.log(results);
        expect(results).to.be.a('null');
        done()
      });
    });
  });
});
