const express = require('express');
const app = express();

app.use('/', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/static/index.html');
});

let _resolve;
const readyPromise = new Promise(resolve => {
  _resolve = resolve
});

const server = app.listen(8000, function() {
  console.log('frontend listening on port 8000');
  _resolve();
});

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
};
