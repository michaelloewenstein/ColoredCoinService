const express = require('express'),
  coloredCoinsService = require('./services/coloredCoinService.js'),
  app = express(),
  bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(require('./controllers'));
coloredCoinsService.init();
app.listen(3000, function(){
  console.log('Thing are happening on port 3000!');
});
