'use strict';

process.env.NODE_ENV = 'test';
process.env.PORT = '6002';

let server = require('../server');
let bookshelf = require('../config/bookshelf');

let chai = require('chai');

let request = require('request');

function getAccessTokenFromResponse(response) {
  return response.headers['set-cookie'][0].split('=')[1].split(';')[0];
}

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
    it('returns all channels and status 200 with valid token', function (done) {
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
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(response) }
        }, function(error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let channels = body;

          chai.expect(channels).to.be.an('array');
          chai.expect(channels.length).to.equal(3);

          done();
        });
      });
    });

    it('returns error 401 without token', function (done) {
      request.get({
        uri: "http://localhost:6002/channels"
      }, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(401);

        done();
      });
    });
  });

  describe('POST /channels/{id}/join', function() {
    let joinUrl = 'http://localhost:6002/channels/3/join';

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
          uri: joinUrl,
          json: true,
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(response) }
        }, function (error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let channel = body;

          chai.expect(channel.id).to.equal(3);
          chai.expect(channel.users.length).to.equal(2);

          done();
        });
      });
    });

    it('does not add user to channel and returns error 401 with invalid token', function (done) {
      request.post({
        uri: joinUrl,
        json: true,
        headers: { 'Cookie': 'accessToken=abcd123' }
      }, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(401);
        done();
      });
    });

    it('does not add user to channel and returns error 401 when token is missing', function (done) {
      request.post({
        uri: joinUrl,
        json: true
      }, function (error, response, body) {
        chai.expect(body.statusCode).to.equal(401);
        done();
      });
    });
  });

  describe('POST /channels/{id}/invite', function() {
    let inviteUrl = 'http://localhost:6002/channels/3/invite';

    it('sends invite and returns status 200', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, res, body) {

        let validInviteData = {
          message: 'Welcome to my channel!',
          inviteename: 'Salli'
        };

        request.post({
          uri: inviteUrl,
          json: true,
          body: validInviteData,
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
        }, function (error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let invite = body;

          chai.expect(invite.inviteeid).to.equal(1);
          chai.expect(invite.inviterid).to.equal(3);
          chai.expect(invite.channelid).to.equal(3);
          chai.expect(invite.message).to.equal('Welcome to my channel!');

          done();
        });
      });
    });

    it('sends invite and returns status 200 when message is missing', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, res, body) {

        let validInviteData = {
          inviteename: 'Salli'
        };

        request.post({
          uri: inviteUrl,
          json: true,
          body: validInviteData,
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
        }, function (error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let invite = body;

          chai.expect(invite.inviteeid).to.equal(1);
          chai.expect(invite.inviterid).to.equal(3);
          chai.expect(invite.channelid).to.equal(3);
          chai.expect(invite.message).to.equal(null);

          done();
        });
      });
    });

    it('does not send invite and returns error 404 if invitee does not exist', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, res, body) {

        let invalidInviteData = {
          message: 'Welcome to my channel!',
          inviteename: 'idontexist'
        };

        request.post({
          uri: inviteUrl,
          json: true,
          body: invalidInviteData,
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
        }, function (error, response, body) {
          chai.expect(response.statusCode).to.equal(404);

          done();
        });
      });
    });

    it('does not send invite and returns error 400 if invitee field is missing', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, res, body) {

        let invalidInviteData = {
          message: 'Welcome to my channel!'
        };

        request.post({
          uri: inviteUrl,
          json: true,
          body: invalidInviteData,
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
        }, function (error, response, body) {
          chai.expect(response.statusCode).to.equal(400);

          done();
        });
      });
    });

    it('does not send invite and returns error 401 without token', function (done) {
      let invalidInviteData = {
        inviteename: 'Salli',
        message: 'Welcome to my channel!'
      };

      request.post({
        uri: inviteUrl,
        json: true,
        body: invalidInviteData
      }, function (error, response, body) {
        chai.expect(response.statusCode).to.equal(401);

        done();
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
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
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
            headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
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
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
        }, function (error, response, body) {
          chai.expect(body.statusCode).to.equal(400);
          chai.expect(body.error).to.equal('Bad Request');

          request.get({
            uri: url,
            json: true,
            headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
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
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
        }, function (error, response, body) {
          chai.expect(body.statusCode).to.equal(400);
          chai.expect(body.error).to.equal('Bad Request');

          request.get({
            uri: url,
            json: true,
            headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
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
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
        }, function (error, response, body) {
          chai.expect(body.statusCode).to.equal(400);
          chai.expect(body.error).to.equal('Bad Request');

          request.get({
            uri: url,
            json: true,
            headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
          }, function (error, response, body) {
            let channels = body;

            chai.expect(channels.length).to.equal(3);

            done();
          });
        });
      });
    });

    it('does not create new channel and returns error 401 without token', function (done) {
      let validPostData = {
        name: 'Programming',
        private: false
      };

      request.post({
        uri: url,
        json: true,
        body: validPostData
      }, function (error, response, body) {
        chai.expect(response.statusCode).to.equal(401);

        done();
      });
    });
  });
});
