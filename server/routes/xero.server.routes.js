
module.exports = function(app){
  var xero = require('./../controllers/xero.server.controller');

  app.route('/api/xero/authenticate').get(xero.authenticate);
  app.route('/api/xero/callback').get(xero.callback);
  app.route('/api/xero/startSync').get(xero.startSync);

};
