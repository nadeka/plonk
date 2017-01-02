'use strict';

process.env.NODE_ENV = 'test';
process.env.PORT = '6002';

let server = require('../server');
let bookshelf = require('../config/bookshelf');
let testToken = require('../config/settings').testToken;

let chai = require('chai');

let request = require('request');

describe('Users', function() {

  beforeEach(function(done) {
    bookshelf.knex.migrate.rollback()
      .then(function() {
        bookshelf.knex.migrate.latest()
          .then(function() {
            return bookshelf.knex.seed.run()
              .then(function() {
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    bookshelf.knex.migrate.rollback()
      .then(function() {
        done();
      });
  });

  describe('GET /users', function() {
    it('returns all users and status 200', function (done) {
      let validUrl = "http://localhost:6002/users";

      request.get({
        uri: validUrl,
        json: true,
        headers: { 'authorization': testToken }
      }, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        let users = body;

        chai.expect(users).to.be.an('array');
        chai.expect(users.length).to.equal(2);

        done();
      });
    });
  });

  describe('GET /users/{id}', function() {
    it('returns correct user and status 200 when given user id is 1', function (done) {
      let validUrl = "http://localhost:6002/users/1";

      request.get({
        uri: validUrl,
        json: true,
        headers: { 'authorization': testToken }
      }, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        let user = body;

        chai.expect(user.name).to.equal('Salli');
        chai.expect(user.createdat).to.be.defined;
        chai.expect(user.updatedat).to.be.defined;

        done();
      });
    });

    it("returns error 400 when given user id is 'asdasd'", function (done) {
      let invalidUrl = "http://localhost:6002/users/asdasd";

      request.get({
        uri: invalidUrl,
        json: true,
        headers: { 'authorization': testToken }
      }, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(400);

        done();
      });
    });

    it("returns error 404 when given user id is 999999", function (done) {
      let invalidUrl = "http://localhost:6002/users/999999";

      request.get({
        uri: invalidUrl,
        json: true,
        headers: { 'authorization': testToken }
      }, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(404);

        done();
      });
    });

    it("returns error 400 when given user id is 10000000", function (done) {
      let invalidUrl = "http://localhost:6002/users/10000000";

      request.get({
        uri: invalidUrl,
        json: true,
        headers: { 'authorization': testToken }
      }, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(400);

        done();
      });
    });
  });
});
