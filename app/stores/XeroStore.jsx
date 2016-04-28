"use strict";
let dispatcher = require("./../dispatcher.js");
let {get} = require("./../RestHelper.js");

function XeroStore() {
  let syncInfo = {},
    changeListeners = [];

  function startSync() {
    get("/api/xero/startSync").then((data) => {
      syncInfo = data;
      triggerListeners();
    });
  }

  function syncInfoFn() {
    get("/api/xero/syncInfo").then((data) => {
      syncInfo = data;
      triggerListeners();
    });
  }

  dispatcher.register(function(event) {
    let split = event.type.split(':');

    if (split[0] === 'xero') {
      switch (split[1]) {
        case "startSync":
          startSync(event.payload);
          break;
        case "syncInfo":
          syncInfoFn(event.payload);
          break;
      }
    }
  });

  function triggerListeners() {
    changeListeners.forEach(function(listener) {
      listener(syncInfo);
    })
  }

  function onChange(listener) {
    changeListeners.push(listener);
  }

  function removeChangeListener(listener) {
    let index = changeListeners.findIndex(i => i === listener);
    changeListeners.splice(index, 1);
  }

  return {
    startSync: startSync,
    syncInfo: syncInfo,
    onChange: onChange,
    removeChangeListener: removeChangeListener,
  };

}

module.exports = new XeroStore();
