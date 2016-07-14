const express = require('express'),
  _ = require('lodash'),
  coloredCoinsService = require('./../services/coloredCoinService.js')
  Promise = require("bluebird");
  router = express.Router();


router.get('/assets', function(req, result){
  coloredCoinsService.getAssets().then(function (res) {
        uniqAssetsIds = _.uniqBy(res, 'assetId').map(function(asset){ return asset.assetId });
        return result.status(200).send(uniqAssetsIds)
    }).catch(function(err){
      console.log(err);
        return result.status(err.status).send(err.message);
    });
});

router.put('/assets', function(req, result){

  var handleErr = function(err){
    var status = err.status ? err.status:400;
    var message = err.error ? err.error : 'Something Went Wrong';
    return result.status(status).send(message);
  };

  var issueAnAsset = function (asset) {
    return new Promise(function(resolve, reject){
        var args = {
            amount: asset.amount,
            metadata: {
                assetName: asset.assetName
                }
            };
      coloredCoinsService.issueAsset(args).then(function(res){
         resolve(issuedAssets.push({ assetName: args.metadata.assetName, assetId: res.assetId }));
      }).catch(function(err){
          reject(err);
      });
    })
  };

  var issuedAssets = [];
  var issuingPrmoises = [];
  _.each(req.body, function(asset){
    var promise = issueAnAsset(asset);
    issuingPrmoises.push(promise);
  });
  Promise.all(issuingPrmoises).then(function(res){
    if(issuedAssets.length > 0){
      var issuedAssetsByOrder = []
      _.each(req.body,function(asset){
          _.each(issuedAssets, function(issuedAsset) {
              if(issuedAsset.assetName == asset.assetName){
                issuedAssetsByOrder.push(issuedAsset.assetId);
              }
          })
      });
      return result.status(200).send(issuedAssetsByOrder);
    }
    else {
      handleErr({message:'Failed To Issue Assets', status:'400'});
    }
  }).catch(handleErr);
});

router.post('/send', function(req, result){
  coloredCoinsService.getAssets()
  .then(function(res){ getMatchingAssets(res).then(function(res){ sendAssets(res) }) } )
  .catch(handleErr);

  var handleErr = function(err){
    var status = err.status ? err.status:400;
    var message = err.message ? err.message : 'Something Went Wrong';
    return result.status(status).send(message);
  };
  var getMatchingAssets = function(assets){
      return new Promise(function(resolve, reject){
        var assetsFrom = _.uniqBy(_.filter(assets, function(asset){
          if((asset.assetId == req.body.assetId) && (asset.amount >= req.body.amount)){
              return asset;
          }
        }), 'address');
        if(assetsFrom.length === 0){
          reject(result.status(404).send('Not Found'));
        }
        resolve(assetsFrom);
      });
  };
  var sendAssets = function(assetsToSend){
    var toAddress =  req.body.toAddress;
    var fromAddress = _.map(assetsToSend, function(asset){ return asset.address});
    var assetId = req.body.assetId;
    var amount = req.body.amount;

    var args = {
        from: fromAddress,
        to: [{
            address: toAddress,
            assetId: assetId,
            amount: amount
        },{
            phoneNumber: '+1234567890',
            assetId: assetId,
            amount: amount
        }]
      };
    coloredCoinsService.sendAsset(args).then(function (body) {
          return result.status(200).send(body.txid);
      });
  };
});

router.get('/encode', function(req, result){
  var handleErr = function (e) {
    result.status(400).send(e);
  }
  const number = parseInt(req.query.number) || 0;
  if(number === 0){
    handleErr('Invalid Input');
  }
  else{
    var encoded = coloredCoinsService.encode(number)
    .then(function(encoded){
      return result.status(200).send(encoded);
    }).catch(handleErr);
  }
});

module.exports = router;
