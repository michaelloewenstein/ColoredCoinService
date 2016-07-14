var Colu = require('colu'),
  config = require('./../config.js'),
  Promise = require("bluebird"),
  sffc = require('sffc-encoder'),
  MAX_NUM_SUPPORTED = 9007199254740992,
  colu = new Colu(config.settings);

  var encodeAsync = function(num){
    return new Promise(function(resolve, reject){
        if (num > MAX_NUM_SUPPORTED){
          throw 'Number Is Too Big';
        }
        var res = sffc.encode(num).toString('hex');
        return resolve(res);
      }).catch(function(err){
          return err;
      });
    };

var getAssetsAsync = Promise.promisify(colu.getAssets.bind(colu));
var sendAssetAsync = Promise.promisify(colu.sendAsset.bind(colu));
var issueAssetAsync = Promise.promisify(colu.issueAsset.bind(colu));


module.exports = {
  init: colu.init.bind(colu),
  getAssets: getAssetsAsync,
  sendAsset: sendAssetAsync,
  issueAsset: issueAssetAsync,
  encode: encodeAsync
};
