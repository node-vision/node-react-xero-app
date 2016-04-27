var dispatcher = require("./../dispatcher.js");

module.exports = {  
  startSync: function() {
    dispatcher.dispatch({type: "xero:startSync", payload: ""})
  } 
};
