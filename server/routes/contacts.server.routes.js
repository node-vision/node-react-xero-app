module.exports = function(app){
  var contacts = require('./../controllers/contacts.server.controller.js');
  var users = require('./../controllers/users.server.controller.js');

  app.route('/api/contacts')
	.get(contacts.list)
	.post(contacts.create);

  app.route('/api/contacts/:id')
	.get(contacts.read)
	.delete(users.requiresLogin, contacts.delete)
	.put(users.requiresLogin, contacts.update);
}
