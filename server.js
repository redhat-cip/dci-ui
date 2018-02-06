const express = require('express');
const app = express();

app.use('/', express.static(__dirname + '/static'));

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/static/index.html');
});

app.listen(8000, function() {
  console.log('frontend listening on port 8000');
});
