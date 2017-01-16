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

  describe('GET /user/channels', function() {
    it('returns empty array and status 200 for user without joined channels', function (done) {
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
          uri: "http://localhost:6002/user/channels",
          json: true,
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(response) }
        }, function(error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let channels = body;

          chai.expect(channels).to.be.an('array');
          chai.expect(channels.length).to.equal(0);

          done();
        });
      });
    });

    it('returns array of size 2 and status 200 for user with 2 joined channels', function (done) {
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
          uri: 'http://localhost:6002/channels/1/join',
          json: true,
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
        }, function (error, response, body) {

          request.post({
            uri: 'http://localhost:6002/channels/2/join',
            json: true,
            headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
          }, function (error, response, body) {

            request.get({
              uri: "http://localhost:6002/user/channels",
              json: true,
              headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(res) }
            }, function(error, response, body) {
              chai.expect(response.statusCode).to.equal(200);

              let channels = body;

              chai.expect(channels).to.be.an('array');
              chai.expect(channels.length).to.equal(2);

              done();
            });
          });
        });
      });
    });
  });

  describe('GET /user/receivedInvitations', function() {
    it('returns empty array and status 200 for user without received invitations', function (done) {
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
          uri: "http://localhost:6002/user/receivedInvitations",
          json: true,
          headers: { 'Cookie': 'accessToken=' + getAccessTokenFromResponse(response) }
        }, function(error, response, body) {
          chai.expect(response.statusCode).to.equal(200);

          let invitations = body;

          chai.expect(invitations).to.be.an('array');
          chai.expect(invitations.length).to.equal(0);

          done();
        });
      });
    });

    it('returns array of size 2 and status 200 for user with 2 received invitations', function (done) {
      let validPostData = {
        name: 'Pirjo',
        password: '123'
      };

      request.post({
        uri: 'http://localhost:6002/register',
        body: validPostData,
        json: true
      }, function (error, res, body) {

        let inviterAccessToken = getAccessTokenFromResponse(res);

        validPostData = {
          name: 'Pekka',
          password: '123'
        };

        request.post({
          uri: 'http://localhost:6002/register',
          body: validPostData,
          json: true
        }, function (error, response, body) {

          let inviteeAccessToken = getAccessTokenFromResponse(response);

          request.post({
            uri: 'http://localhost:6002/channels/1/invite',
            json: true,
            body: {
              inviteename: 'Pekka',
              message: 'Welcome!'
            },
            headers: {'Cookie': 'accessToken=' + inviterAccessToken}
          }, function (error, r, body) {

            request.post({
              uri: 'http://localhost:6002/channels/2/invite',
              json: true,
              body: {
                inviteename: 'Pekka',
                message: 'Welcome!'
              },
              headers: {'Cookie': 'accessToken=' + inviterAccessToken}
            }, function (error, r, body) {

              request.get({
                uri: "http://localhost:6002/user/receivedInvitations",
                json: true,
                headers: {'Cookie': 'accessToken=' + inviteeAccessToken}
              }, function (error, response, body) {
                chai.expect(response.statusCode).to.equal(200);

                let invitations = body;

                chai.expect(invitations).to.be.an('array');
                chai.expect(invitations.length).to.equal(2);

                invitations.forEach(inv =>
                  chai.expect(inv.inviteeid).to.equal(4) &&
                  chai.expect(inv.inviterid).to.equal(3) &&
                  chai.expect(inv.message).to.equal('Welcome!')
                );

                done();
              });
            });
          });
        });
      });
    });
  });
});
