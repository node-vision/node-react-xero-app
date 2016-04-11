module.exports = function(app){
  var invoices = require('./../controllers/invoices.server.controller.js');
  var users = require('./../controllers/users.server.controller.js');

  app.route('/api/invoices')
	.get(invoices.list)
	.post(invoices.create);

  app.route('/api/invoices/:id')
	.get(invoices.read)
	.delete(users.requiresLogin, invoices.delete)
	.put(users.requiresLogin, invoices.update);
}
