'use strict';

process.env.NODE_ENV = 'test';
process.env.PORT = '6002';

let server = require('../server');
let bookshelf = require('../config/bookshelf');

let chai = require('chai');

let request = require('request');

describe('Auth', function() {

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

  describe("POST /register", function() {
    let registerUrl = "http://localhost:6002/register";
    let usersUrl = "http://localhost:6002/users";

    it('creates new user and returns status 200 when valid payload is given', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: registerUrl,
        body: validPostData,
        json: true
      }, function (error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        let user = body;

        chai.expect(user.id).to.equal(3);

        request.get({
          uri: usersUrl,
          json: true,
          headers: {
            'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0]
          }
        }, function (error, response, body) {
          let users = body;
          
          chai.expect(users.length).to.equal(3);

          done();
        });
      });
    });

    it('does not create new user and returns error 400 when name is empty', function (done) {
      let invalidPostData = {
        name: '',
        password: 'abc'
      };

      request.post({
        uri: registerUrl,
        body: invalidPostData,
        json: true
      }, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        done();
      });
    });

    it('does not create new user and returns error 400 when name is null', function (done) {
      let invalidPostData = {
        name: null,
        password: 'abc'
      };

      request.post({
        uri: registerUrl,
        body: invalidPostData,
        json: true
      }, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        done();
      });
    });

    it('does not create new user and returns error 400 when name field is missing', function (done) {
      let invalidPostData = {
        password: 'abc'
      };

      request.post({
        uri: registerUrl,
        body: invalidPostData,
        json: true
      }, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        done();
      });
    })
  });

  describe('POST /login', function() {
    it('should successfully authenticate existing user with correct password', function (done) {
      let registerUrl = "http://localhost:6002/register";
      let loginUrl = "http://localhost:6002/login";

      let validRegisterData = {
        name: 'Pirjo',
        password: 'abc'
      };

      request.post({
        uri: registerUrl,
        body: validRegisterData,
        json: true
      }, function (error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        let user = body;

        chai.expect(user.id).to.equal(3);

        let validLoginData = {
          name: 'Pirjo',
          password: 'abc'
        };

        request.post({
          uri: loginUrl,
          body: validLoginData,
          json: true
        }, function (error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let user = body;

          chai.expect(user.id).to.equal(3);

          done();
        });
      });
    });

    it('should not successfully authenticate existing user with incorrect password', function (done) {
      let registerUrl = "http://localhost:6002/register";
      let loginUrl = "http://localhost:6002/login";

      let validRegisterData = {
        name: 'Pirjo',
        password: 'abc'
      };

      request.post({
        uri: registerUrl,
        body: validRegisterData,
        json: true
      }, function (error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        let user = body;

        chai.expect(user.id).to.equal(3);

        let invalidLoginData = {
          name: 'Pirjo',
          password: 'abcd'
        };

        request.post({
          uri: loginUrl,
          body: invalidLoginData,
          json: true
        }, function (error, response, body) {
          chai.expect(body.statusCode).to.equal(401);
          chai.expect(body.error).to.equal('Unauthorized');

          done();
        });
      });
    });
  });

  it('should not successfully authenticate non-existing user', function (done) {
    let url = "http://localhost:6002/login";

    let invalidLoginData = {
      name: 'idontexist',
      password: 'abc'
    };

    request.post({
      uri: url,
      body: invalidLoginData,
      json: true
    }, function (error, response, body) {
      chai.expect(body.statusCode).to.equal(404);
      chai.expect(body.error).to.equal('Not Found');

      done();
    });
  });
});
