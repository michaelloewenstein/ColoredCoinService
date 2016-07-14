const app = require('./../app.js'),
  should = require("should"),
  supertest = require('supertest'),
  BPromise = require('bluebird'),
  _ = require('lodash'),
  server = supertest.agent("http://localhost:3000"),
  timeout = 100000;


describe('GET /assets', function () {

  it("Get An Assets Array",
  function(done){
    this.timeout(timeout);
    server
    .get('/assets')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      should.equal(err, null);
      should(Array.isArray(res.body)).equal(true);
      done();
    });
  });
});

it("Get A Uniq Assets Array",
function(done){
  this.timeout(timeout);
  server
  .get('/assets')
  .expect("Content-type",/json/)
  .expect(200)
  .end(function(err,res){
    should.equal(err, null);
    uniqAssets = _.uniq(res.body);
    should(uniqAssets.length).equal(res.body.length);
    done();
  });
});

describe('PUT /issue', function () {

  it("Issue An Asset",
  function(done){
    this.timeout(timeout);
    server
    .put('/assets')
    .send([{assetName:'testAsset1', amount:'1'},{assetName:'testAsset2', amount:'2'}])
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      should.equal(err, null);
      should(Array.isArray(res.body)).equal(true);
      done();
    });
  });
});

describe('PUT /issue', function () {

  it("Fail To Issue An Asset",
  function(done){
    this.timeout(timeout);
    server
    .put('/assets')
    .send([{assetName:'testAsset1', amount:'-1'}])
    .expect("Content-type",'text/html; charset=utf-8')
    .expect(400)
    .end(function(err,res){
      should.equal(res.text,'Number is out of bounds');
      done();
    });
  });
});

describe('POST /send', function () {
  //TBD - Send Dynamic AssetId
  it("Send an Asset",
  function(done){
    this.timeout(timeout);
    server
    .post('/send')
    .send({toAddress:'msCbd78mgoKsg48VWXCTuAccxHnmmpVE5e', assetId:'LaAT8bzAPLWNRgYoWmrGjtzsMzd9w2PGdDj9Cs', amount:1})
    .expect("Content-type",'text/html; charset=utf-8')
    .expect(200)
    .end(function(err,res){
      should.equal(err, null);
      done();
    });
  });

  //TBD - Handle unhandled rejection
  it.skip("Fail To Send an Asset",
  function(done){
    this.timeout(timeout);
    server
    .post('/send')
    .send({toAddress:'msCbd78mgoKsg48VWXCTuAccxHnmmpVE5e', assetId:'OMG', amount:1})
    .expect("Content-type",'text/html; charset=utf-8')
    .expect(404)
    .end(function(err,res){
      console.log(res.text);
      should.equal(res.text,'Not Found');
      done();
    });
  });

});

describe('GET /encode', function () {
  it("Encode a number",
  function(done){
    this.timeout(timeout);
    server
    .get('/encode')
    .query({ number: 1200032 })
    .expect("Content-type",'text/html; charset=utf-8')
    .expect(200)
    .end(function(err,res){
      should.equal(err, null);
      res.text.should.equal('6124fa00');
      done();
    });
  });
});

describe('GET /encode', function () {
  it("Fail To Encode A Non Number",
  function(done){
    this.timeout(timeout);
    server
    .get('/encode')
    .query({ number: 'NaNOMG' })
    .expect("Content-type",'text/html; charset=utf-8')
    .expect(400)
    .end(function(err,res){
      res.text.should.equal('Invalid Input');
      done();
    });
  });
});
