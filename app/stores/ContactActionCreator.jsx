var dispatcher = require("./../dispatcher.js");

module.exports = {
  list: function() {
    dispatcher.dispatch({type: "contact:list", payload: ""})
  },
  get: function(contactId) {
    dispatcher.dispatch({type: "contact:get", payload: contactId})
  },
  add: function(contact) {
    dispatcher.dispatch({type: "contact:add", payload: contact})
  },
  update: function(contact) {
    dispatcher.dispatch({type: "contact:update", payload: contact})
  },
  delete: function(contact, history) {
    dispatcher.dispatch({
      type: "contact:delete",
      payload: {
        data: contact,
        history: history
      }
    });
  }

}
