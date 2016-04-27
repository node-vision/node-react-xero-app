"use strict";
let dispatcher = require("./../dispatcher.js");
let {get} = require("./../RestHelper.js");

function XeroStore() {
  let syncInfo = {};

  function startSync() {
    get("/api/xero/startSync").then((data) => {
      console.log('xc data ');
      console.log(data);
      syncInfo = data;
    });
  }

  dispatcher.register(function(event) {
    let split = event.type.split(':');

    if (split[0] === 'xero') {
      switch (split[1]) {
        case "startSync":
          startSync(event.payload);
          break;
      }
    }
  });
  
  return {
    startSync: startSync
  };

}

module.exports = new XeroStore();
