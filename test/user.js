'use strict';

process.env.NODE_ENV = 'test';
process.env.PORT = '6002';

let server = require('../server');
let bookshelf = require('../config/bookshelf');

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
    it('returns all users and status 200 when given cookie is valid', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: "http://localhost:6002/register",
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/users",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let users = body;

          chai.expect(users).to.be.an('array');
          chai.expect(users.length).to.equal(3);

          done();
        });
      });
    });
  });

  describe('GET /users/{id}', function() {
    it('returns correct user and status 200 when given user id is 1 and cookie is valid', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: "http://localhost:6002/register",
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/users/1",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let user = body;

          chai.expect(user.name).to.equal('Salli');
          chai.expect(user.createdat).to.be.defined;
          chai.expect(user.updatedat).to.be.defined;

          done();
        });
      });
    });

    it("returns error 400 when given user id is 'asdasd' and cookie is valid", function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: "http://localhost:6002/register",
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/users/asdasd",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(body.statusCode).to.equal(400);

          done();
        });
      });
    });

    it("returns error 404 when given user id is 999999 and cookie is valid", function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: "http://localhost:6002/register",
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/users/999999",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(body.statusCode).to.equal(404);

          done();
        });
      });
    });

    it("returns error 400 when given user id is 10000000 and cookie is valid", function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: "http://localhost:6002/register",
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/users/10000000",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(body.statusCode).to.equal(400);

          done();
        });
      });
    });
  });
});
