"use strict";
let dispatcher = require("./../dispatcher.js");
let {get, post, del, put} = require("./../RestHelper.js");
let auth = require("./../services/Authentication.js");

function InvoiceStore() {
  let dataInvoices = [],
    changeListeners = [],
    dataInvoice = {};
  
  function triggerListeners() {
    changeListeners.forEach(function(listener) {
      listener(dataInvoices);
    })
  }

  function fetchInvoices() {
    get("/api/invoices").then((data) => {
      dataInvoices = data;
      triggerListeners();
    });
  }
  
  function fetchInvoice(id) {
    get(`/api/invoices/${id}`).then((data) => {
      dataInvoice = data[0];
      triggerListeners();
    });
  }
  
  function removeInvoice(invoice) {
    let index = dataInvoices.findIndex(x => x._id === invoice._id);
    dataInvoice = dataInvoices.splice(index, 1)[0];

    del(`api/invoices/${dataInvoice._id}`).then(() => {
      dataInvoice = 'deleted';
      triggerListeners();
    }).catch((err) => {
      if (err.status == 401) {
        auth.logout();
        dataInvoice = "Not Authorized";
      } else {
        dataInvoice = dataInvoice;
      }
      dataInvoices.splice(index, 0, dataInvoice);
      
      triggerListeners();
    })
  }
  
  function addInvoice(invoice) {
    post("/api/invoices", invoice).then((data) => {
      dataInvoices.push(data);
      triggerListeners();
    }).catch(() => {
      console.log('Error on add');
    })
  }

  function updateInvoice(invoice) {
    let index = dataInvoices.findIndex(x => x._id === invoice._id);

    put(`/api/invoices/${invoice._id}`, invoice).then((data) => {
      dataInvoices[index] = data;
      dataInvoice = data;
      triggerListeners();
    }).catch((err) => {
      if (err.status === 401) {
        auth.logout(null, err.status);
      }

      console.log('Error on add');
    })
  }

  function getInvoices() {
    return dataInvoices;
  }
  
  function getInvoice() {
    return dataInvoice;
  }
  
  function onChange(listener) {
    changeListeners.push(listener);
  }
  
  function removeChangeListener(listener) {
    let index = changeListeners.findIndex(i => i === listener);
    changeListeners.splice(index, 1);
  }
  
  dispatcher.register(function(event) {
    let split = event.type.split(':');

    if (split[0] === 'invoice') {
      switch (split[1]) {
        case "add":
          addInvoice(event.payload);
          break;
        case "update":
          updateInvoice(event.payload);
          break;
        case "delete":
          removeInvoice(event.payload.data);
          break;
      }
    }
  });
  
  return {
    getInvoices: getInvoices,
    onChange: onChange,
    fetchInvoices: fetchInvoices,
    fetchInvoice: fetchInvoice,
    getInvoice: getInvoice,
    removeChangeListener: removeChangeListener
  }
}

module.exports = new InvoiceStore();
