var Q = require("q")
var app = require("../../app")
var request = require("supertest")
var nock = require("nock")

var logger = require('../../src/lib/logger');
var winston = require('winston')
require("chai").should()

describe("update logger level test", function(){
    var testLoggerTransport;
    beforeEach(function(){
        nock('http://localhost:8005')
            .get('/userpi/user/session?token=validToken')
            .reply(200, {"username": "john","shortName": "John"}, { 'content-type': 'application/json'});
        testLoggerTransport = new winston.transports.Console;
        logger.transports['test']=testLoggerTransport
        logger.transports.console.level = 'info'
    })

    it("should update logger level", function(done){
        Q.spread([logger],
            function(logger){
                request(app)
                    .put("/logger")
                    .send({
                        level: "debug"
                    })
                    .set("Cookie", ["auth-token=validToken"])
                    .expect(200)
                    .end(function(err, res){
                        if(err) return done(err);
                        logger.transports.console.level.should.be.eq("debug");
                        testLoggerTransport.level.should.be.eq("debug")
                        logger.level.should.be.eq("debug")
                        done();
                    })
            })
    })

    it("should error out on no logger level", function(done){
        Q.spread([logger],
            function(logger){
                request(app)
                    .put("/logger")
                    .send()
                    .set("Cookie", ["auth-token=validToken"])
                    .expect(422)
                    .end(function(err, res){
                        if(err) {
                            return done(err);
                        }

                        logger.transports.console.level.should.be.eq("info");
                        done();
                    })
            })
    })
})