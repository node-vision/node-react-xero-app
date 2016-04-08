"use strict";
let dispatcher = require("./../dispatcher.js");
let {get, post, del, put} = require("./../RestHelper.js");
let auth = require("./../services/Authentication.js");

function ContactStore() {
  let dataContacts = [],
    changeListeners = [],
    dataContact = {};
  
  function triggerListeners() {
    changeListeners.forEach(function(listener) {
      listener(dataContacts);
    })
  }

  function fetchContacts() {
    get("/api/contacts").then((data) => {
      dataContacts = data;
      triggerListeners();
    });
  }
  
  function fetchContact(id) {
    get(`/api/contacts/${id}`).then((data) => {
      dataContact = data[0];
      triggerListeners();
    });
  }
  
  function removeContact(contact) {
    let index = dataContacts.findIndex(x => x._id === contact._id);
    dataContact = dataContacts.splice(index, 1)[0];

    del(`api/contacts/${dataContact._id}`).then(() => {
      dataContact = 'deleted';
      triggerListeners();
    }).catch((err) => {
      if (err.status == 401) {
        auth.logout();
        dataContact = "Not Authorized";
      } else {
        dataContact = dataContact;
      }
      dataContacts.splice(index, 0, dataContact);
      
      triggerListeners();
    })
  }
  
  function addContact(contact) {
    post("/api/contacts", contact).then((data) => {
      dataContacts.push(data);
      triggerListeners();
    }).catch(() => {
      console.log('Error on add');
    })
  }

  function updateContact(contact) {
    let index = dataContacts.findIndex(x => x._id === contact._id);
    dataContacts[index] = contact;

    console.log(contact);

    put(`/api/contacts/${dataContact._id}`, contact).then((data) => {
      triggerListeners();
    }).catch(() => {
      console.log('Error on add');
    })
  }

  function getContacts() {
    return dataContacts;
  }
  
  function getContact() {
    return dataContact;
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

    if (split[0] === 'contact') {
      switch (split[1]) {
        case "add":
          addContact(event.payload);
          break;
        case "update":
          updateContact(event.payload);
          break;
        case "delete":
          removeContact(event.payload.data);
          break;
      }
    }
  });
  
  return {
    getContacts: getContacts,
    onChange: onChange,
    fetchContacts: fetchContacts,
    fetchContact: fetchContact,
    getContact: getContact,
    removeChangeListener: removeChangeListener
  }
}

module.exports = new ContactStore();
