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
    it('returns all users and status 200', function (done) {
      let validUrl = "http://localhost:6002/users";

      request.get({uri: validUrl, json: true}, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        let users = body;

        chai.expect(users).to.be.an('array');
        chai.expect(users.length).to.equal(2);

        done();
      });
    });
  });

  describe('GET /users/{id}', function() {
    it('returns correct user and status 200 when valid id is given', function (done) {
      let validUrl = "http://localhost:6002/users/1";

      request.get({uri: validUrl, json: true}, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        let user = body;

        chai.expect(user.name).to.equal('Salli');
        chai.expect(user.password).to.equal('sallisa');
        chai.expect(user.createdat).to.be.defined;
        chai.expect(user.updatedat).to.be.defined;

        done();
      });
    });

    it("returns error 404 when invalid id is given", function (done) {
      let invalidUrl = "http://localhost:6002/users/asdasd";

      request.get({uri: invalidUrl, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(404);

        done();
      });
    });

    it("returns error 404 when given id does not exist", function (done) {
      let invalidUrl = "http://localhost:6002/users/999999";

      request.get({uri: invalidUrl, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(404);

        done();
      });
    });
  });

  describe("POST /users", function() {
    let url = "http://localhost:6002/users";

    it('creates new user and returns status 200 when valid payload is given', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: 'abc'
      };

      request.post({uri: url, body: validPostData, json: true}, function (error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        let user = body;

        chai.expect(user.name).to.equal('Pirjo');
        chai.expect(user.password).to.equal('abc');

        request.get({uri: url, json: true}, function (error, response, body) {
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

      request.post({uri: url, body: invalidPostData, json: true}, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        request.get({uri: url, json: true}, function (error, response, body) {
          let users = body;

          chai.expect(users.length).to.equal(2);

          done();
        });
      });
    });

    it('does not create new user and returns error 400 when name is null', function (done) {
      let invalidPostData = {
        name: null,
        password: 'abc'
      };

      request.post({uri: url, body: invalidPostData, json: true}, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        request.get({uri: url, json: true}, function (error, response, body) {
          let users = body;

          chai.expect(users.length).to.equal(2);

          done();
        });
      });
    });

    it('does not create new user and returns error 400 when name field is missing', function (done) {
      let invalidPostData = {
        password: 'abc'
      };

      request.post({uri: url, body: invalidPostData, json: true}, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        request.get({uri: url, json: true}, function (error, response, body) {
          let users = body;

          chai.expect(users.length).to.equal(2);

          done();
        });
      });
    })
  })
});
