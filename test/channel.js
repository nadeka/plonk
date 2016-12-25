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
    it('returns all channels and status 200', function (done) {
      let validUrl = "http://localhost:6002/channels";

      request.get({uri: validUrl, json: true}, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        let channels = body;

        chai.expect(channels).to.be.an('array');
        chai.expect(channels.length).to.equal(2);

        done();
      });
    });
  });

  describe('GET /channels/{id}', function() {
    it('returns correct channel and status 200 when valid id is given', function (done) {
      let validUrl = "http://localhost:6002/channels/1";

      request.get({uri: validUrl, json: true}, function(error, response, body) {
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

    it("returns error 404 when invalid id is given", function (done) {
      let invalidUrl = "http://localhost:6002/channels/asdasd";

      request.get({uri: invalidUrl, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(404);

        done();
      });
    });

    it("returns error 404 when given id does not exist", function (done) {
      let invalidUrl = "http://localhost:6002/channels/999999";

      request.get({uri: invalidUrl, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(404);

        done();
      });
    });
  });

  describe('POST /channels/{id}/join', function() {
    let url = 'http://localhost:6002/channels/1';

    it('adds valid user to channel and returns status 200', function (done) {
      let validPostData = {
        userid: 2
      };

      request.post({uri: url + '/join', body: validPostData, json: true}, function (error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        chai.expect(body).to.equal('Successfully joined channel.');

        request.get({uri: url, json: true}, function (error, response, body) {
          let channel = body;

          chai.expect(channel.users.length).to.equal(2);

          done();
        });
      });
    });

    it('does not add user to channel and returns error 400 when invalid user id is given', function (done) {
      let invalidPostData = {
        userid: 'asdasd'
      };

      request.post({uri: url + '/join', body: invalidPostData, json: true}, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        request.get({uri: url, json: true}, function (error, response, body) {
          let channel = body;

          chai.expect(channel.users.length).to.equal(1);

          done();
        });
      });
    });
  });

  describe("POST /channels", function() {
    let url = "http://localhost:6002/channels";

    it('creates new channel and returns status 200 when valid payload is given', function (done) {
      let validPostData = {
        name: 'Programming',
        private: false,
        creatorid: 1
      };

      request.post({uri: url, body: validPostData, json: true}, function (error, response, body) {
        chai.expect(response.statusCode).to.equal(200);

        let channel = body;

        chai.expect(channel.name).to.equal('Programming');
        chai.expect(channel.private).to.equal(false);
        chai.expect(channel.creatorid).to.equal(1);
        chai.expect(channel.createdat).to.be.defined;
        chai.expect(channel.updatedat).to.be.defined;

        request.get({uri: url, json: true}, function (error, response, body) {
          let channels = body;

          chai.expect(channels.length).to.equal(3);

          done();
        });
      });
    });

    it('does not create new channel and returns error 400 when name is empty', function (done) {
      let invalidPostData = {
        name: '',
        private: false,
        creatorid: 1
      };

      request.post({uri: url, body: invalidPostData, json: true}, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        request.get({uri: url, json: true}, function (error, response, body) {
          let channels = body;

          chai.expect(channels.length).to.equal(2);

          done();
        });
      });
    });

    it('does not create new channel and returns error 400 when name is null', function (done) {
      let invalidPostData = {
        name: null,
        private: false,
        creatorid: 1
      };

      request.post({uri: url, body: invalidPostData, json: true}, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        request.get({uri: url, json: true}, function (error, response, body) {
          let channels = body;

          chai.expect(channels.length).to.equal(2);

          done();
        });
      });
    });

    it('does not create new channel and returns error 400 when name field is missing', function (done) {
      let invalidPostData = {
        private: false,
        creatorid: 1
      };

      request.post({uri: url, body: invalidPostData, json: true}, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        request.get({uri: url, json: true}, function (error, response, body) {
          let channels = body;

          chai.expect(channels.length).to.equal(2);

          done();
        });
      });
    })
  })
});
