'use strict';

process.env.NODE_ENV = 'test';
process.env.PORT = '6002';

let server = require('../server');
let bookshelf = require('../config/bookshelf');

let chai = require('chai');

let request = require('request');

describe('Channels', function() {

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


  describe('GET /channels', function() {
    it('returns all channels and status 200 when given cookie is valid', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/channels",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let channels = body;

          chai.expect(channels).to.be.an('array');
          chai.expect(channels.length).to.equal(3);

          done();
        });
      });
    });
  });

  describe('GET /channels/{id}', function() {
    it('returns correct channel and status 200 when given channel id is 1 and cookie is valid', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/channels/1",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let channel = body;

          chai.expect(channel.name).to.equal('Movies');
          chai.expect(channel.private).to.equal(false);
          chai.expect(channel.creatorid).to.equal(1);
          chai.expect(channel.createdat).to.be.defined;
          chai.expect(channel.updatedat).to.be.defined;

          done();
        });
      });
    });

    it("returns error 400 when given channel id is 'asdasd' and cookie is valid", function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/channels/asdasd",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(body.statusCode).to.equal(400);

          done();
        });
      });
    });

    it("returns error 404 when given channel id is 999999 and cookie is valid", function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/channels/999999",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(body.statusCode).to.equal(404);

          done();
        });
      });
    });

    it("returns error 400 when given channel id is -1 and cookie is valid", function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/channels/-1",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(body.statusCode).to.equal(400);

          done();
        });
      });
    });

    it("returns error 400 when given id is 10000000 and cookie is valid", function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.get({
          uri: "http://localhost:6002/channels/10000000",
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function(error, response, body) {
          chai.expect(body.statusCode).to.equal(400);

          done();
        });
      });
    });
  });

  describe('POST /channels/{id}/join', function() {
    let url = 'http://localhost:6002/channels/3';

    it('adds user with valid cookie to channel and returns status 200', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, response, body) {
        request.post({
          uri: url + '/join',
          json: true,
          headers: { 'Cookie': 'accessToken=' + response.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function (error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let channel = body;

          chai.expect(channel.id).to.equal(3);
          chai.expect(channel.users.length).to.equal(2);

          done();
        });
      });
    });

    it('does not add user to channel and returns error 400 if cookie is "abcd123"', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, res, body) {
        request.post({
          uri: url + '/join',
          json: true,
          headers: { 'Cookie': 'abcd123' }
        }, function (error, response, body) {
          chai.expect(body.statusCode).to.equal(400);
          chai.expect(body.error).to.equal('Bad Request');

          request.get({
            uri: url,
            json: true,
            headers: { 'Cookie': 'accessToken=' + res.headers['set-cookie'][0].split('=')[1].split(';')[0] }
          }, function (error, response, body) {
            let channel = body;

            chai.expect(channel.users.length).to.equal(1);

            done();
          });
        });
      });
    });
  });

  describe("POST /channels", function() {
    let url = "http://localhost:6002/channels";

    it('creates new channel and returns status 200 when valid payload and cookie are given', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, res, body) {
        validPostData = {
          name: 'Programming',
          private: false
        };

        request.post({
          uri: url,
          body: validPostData,
          json: true,
          headers: { 'Cookie': 'accessToken=' + res.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function (error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let channel = body;

          chai.expect(channel.name).to.equal('Programming');
          chai.expect(channel.private).to.equal(false);
          chai.expect(channel.creatorid).to.equal(3);
          chai.expect(channel.createdat).to.be.defined;
          chai.expect(channel.updatedat).to.be.defined;

          request.get({
            uri: url,
            json: true,
            headers: { 'Cookie': 'accessToken=' + res.headers['set-cookie'][0].split('=')[1].split(';')[0] }
          }, function (error, response, body) {
            let channels = body;

            chai.expect(channels.length).to.equal(4);

            done();
          });
        });
      });
    });

    it('does not create new channel and returns error 400 when name is empty', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, res, body) {
        let invalidPostData = {
          name: '',
          private: false
        };

        request.post({
          uri: url,
          body: invalidPostData,
          json: true,
          headers: { 'Cookie': 'accessToken=' + res.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function (error, response, body) {
          chai.expect(body.statusCode).to.equal(400);
          chai.expect(body.error).to.equal('Bad Request');

          request.get({
            uri: url,
            json: true,
            headers: { 'Cookie': 'accessToken=' + res.headers['set-cookie'][0].split('=')[1].split(';')[0] }
          }, function (error, response, body) {
            let channels = body;

            chai.expect(channels.length).to.equal(3);

            done();
          });
        });
      });
    });

    it('does not create new channel and returns error 400 when name is null', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, res, body) {
        let invalidPostData = {
          name: null,
          private: false
        };

        request.post({
          uri: url,
          body: invalidPostData,
          json: true,
          headers: { 'Cookie': 'accessToken=' + res.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function (error, response, body) {
          chai.expect(body.statusCode).to.equal(400);
          chai.expect(body.error).to.equal('Bad Request');

          request.get({
            uri: url,
            json: true,
            headers: { 'Cookie': 'accessToken=' + res.headers['set-cookie'][0].split('=')[1].split(';')[0] }
          }, function (error, response, body) {
            let channels = body;

            chai.expect(channels.length).to.equal(3);

            done();
          });
        });
      });
    });

    it('does not create new channel and returns error 400 when name field is missing', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, res, body) {
        let invalidPostData = {
          private: false
        };

        request.post({
          uri: url,
          body: invalidPostData,
          json: true,
          headers: { 'Cookie': 'accessToken=' + res.headers['set-cookie'][0].split('=')[1].split(';')[0] }
        }, function (error, response, body) {
          chai.expect(body.statusCode).to.equal(400);
          chai.expect(body.error).to.equal('Bad Request');

          request.get({
            uri: url,
            json: true,
            headers: { 'Cookie': 'accessToken=' + res.headers['set-cookie'][0].split('=')[1].split(';')[0] }
          }, function (error, response, body) {
            let channels = body;

            chai.expect(channels.length).to.equal(3);

            done();
          });
        });
      });
    })
  })
});
