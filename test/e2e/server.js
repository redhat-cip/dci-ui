function makeTestServer(done) {
  const express = require('express');
  const path = require('path');
  const app = express();

  app.use('/', express.static(path.resolve('static')));

  app.get('/', function(req, res) {
    res.sendFile(path.resolve('static/index.html'));
  });

  return app.listen(8888, function() {
    done()
  });
}

module.exports = makeTestServer;
