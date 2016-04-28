/**
 * Created by Roman on 27/04/2016.
 */
var async = require('async');
var config = require('../config/config');
var Contact  = require('../models/Contact');
var Invoice  = require('../models/Invoice');
var xeroTransforms  = require('../services/xeroTransforms');

//xero returns invalid invoiceid for invoices which had some errors, we need to identify them and fix later
var INVALID_INVOICE_ID = '00000000-0000-0000-0000-000000000000';


var xeroClient = require('xero-client')({
  xeroConsumerKey: config.xeroConsumerKey,
  xeroConsumerSecret: config.xeroConsumerSecret,
  xeroCallbackUrl: config.xeroCallbackUrl
});

exports.authenticate = xeroClient.authenticate;
exports.callback = xeroClient.callback;

exports.startSync = function(req, res){
  async.waterfall([function(callback){
    exports.syncContacts(req, callback);
  }, function(callback){
    exports.syncInvoices(req, callback);
  }], function(err){
    xeroClient.syncStatus(req, function(json){
      res.json(json);
    });
  });
};

exports.syncInfo = function(req, res){
  xeroClient.syncStatus(req, function(json) {
    res.json(json);
  });
};

exports.syncContacts = function(req, callback){
  var existingContacts = {};
  var existingContactsArr;
  async.waterfall([function(callback){        
    var xeroContacts = [];
    Contact.find({}, function(err, contacts){
      if (err) {
        return callback(err);
      }
      existingContactsArr = contacts;
      contacts.forEach(function(contact){
        var contactId = contact._id.toString();
        existingContacts[contactId] = contact;        
        xeroContacts.push(xeroTransforms.localContactToXeroContact(contact));
      });
      callback(null, xeroContacts);
    });
  }, function(xeroContacts, callback){
    xeroClient.syncContacts(xeroContacts, req, function(err, contacts){
      if (err){
        return callback(err);
      }
      contacts.forEach(function(contact){
        if (existingContacts[contact.ContactNumber] && !existingContacts[contact.ContactNumber].xeroContactId){
          existingContacts[contact.ContactNumber].xeroContactId = contact.ContactID
        }
      });
      callback();
    });    
  }, function(callback){     
    existingContactsArr.forEach(function(contact){
      contact.save();
    });
    callback();
  }], function(err){
    if (err){
      console.error(err);
      return callback(err);    
    }    
    callback();
  });
};

exports.syncInvoices = function(req, callback){
  var existingInvoices = {};
  var existingInvoicesToSave;

  async.waterfall([
    function(callback){
      Invoice.find({}).exec(function(err, invoices){
        existingInvoicesToSave = invoices;
        callback(err, invoices);
      });
    },function(invoices, callback){
      var contactMap = {};
      Contact.find({}, function(err, contacts){
        if (err){
          return callback(err);
        }
        contacts.forEach(function(contact){
          contactMap[contact._id] = contact.xeroContactId;
        });
        //build xeroInvoices with xeroContactId from contact map
        var xeroInvoices = [];
        invoices.forEach(function(invoice){
          existingInvoices[invoice._id.toString()] = invoice;
          var contactId = contactMap[invoice.contact.toString()];
          xeroInvoices.push(xeroTransforms.localInvoiceToXeroInvoice(invoice, contactId));
        });
        callback(null, xeroInvoices);
      });      
      //filter out invoices which don't have contact 
    }, function(xeroInvoices, callback){
      xeroInvoices = xeroInvoices.filter(function(invoice){
        return (invoice.Contact && invoice.Contact.ContactID);
      });
      xeroClient.syncInvoices(xeroInvoices, req, function(err, invoices){
        if (err){
          return callback(err);
        }       
        invoices.forEach(function(invoice){
          if (existingInvoices[invoice.InvoiceNumber]
            && (!existingInvoices[invoice.InvoiceNumber].xeroInvoiceId
            || existingInvoices[invoice.InvoiceNumber].xeroInvoiceId === INVALID_INVOICE_ID )){
            existingInvoices[invoice.InvoiceNumber].xeroInvoiceId = invoice.InvoiceID;
          }
        });
        callback();
      })
    }, function(callback){
      existingInvoicesToSave.forEach(function(invoice){
        invoice.save();
      });
      callback();
    }], function(err){
    if (err){
      console.error(err);
      return callback(err);
    }
    callback();
  });
};