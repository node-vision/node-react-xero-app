var dispatcher = require("./../dispatcher.js");

module.exports = {  
  startSync: function() {
    dispatcher.dispatch({type: "xero:startSync", payload: ""})
  },
  syncInfo: function() {
    dispatcher.dispatch({type: "xero:syncInfo", payload: ""})
  }
};
