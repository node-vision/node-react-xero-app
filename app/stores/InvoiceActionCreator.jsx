var dispatcher = require("./../dispatcher.js");

module.exports = {
  list: function() {
    dispatcher.dispatch({type: "invoice:list", payload: ""})
  },
  get: function(invoiceId) {
    dispatcher.dispatch({type: "invoice:get", payload: invoiceId})
  },
  add: function(invoice) {
    dispatcher.dispatch({type: "invoice:add", payload: invoice})
  },
  update: function(invoice) {
    dispatcher.dispatch({type: "invoice:update", payload: invoice})
  },
  delete: function(invoice, history) {
    dispatcher.dispatch({
      type: "invoice:delete",
      payload: {
        data: invoice,
        history: history
      }
    });
  }

}
