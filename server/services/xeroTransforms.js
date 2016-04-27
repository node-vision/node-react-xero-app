/**
 * Created by Roman Mandryk on 20/04/2016.
 */
var _ = require('lodash');
var moment = require('moment');

var xeroDateRegex = /Date\((.*)\)/;


/** *
 * @param xeroDate in format /Date(123456123456+1200)/
 */
function xeroDateToJsDate(xeroDate){
  var match = xeroDateRegex.exec(xeroDate);
  return moment(match[1], 'xZ').toDate();
}

/**
 * Transforms jsDate to format supported by Xero.
 * @param jsDate
 * @returns {*}
 */
function jsDateToXeroDate(jsDate){
  return moment(jsDate).format('YYYY-MM-DD');
}


exports.localInvoiceToXeroInvoice = function(localInvoice, contactId){
  //if already have xero info we will only update status
  var xeroInvoice = {};
  if (localInvoice.xeroInvoiceId){
    xeroInvoice.InvoiceID = localInvoice.xeroInvoiceId;
  }
  xeroInvoice.Type = 'ACCREC';
  xeroInvoice.InvoiceNumber = localInvoice._id.toString();
  xeroInvoice.DueDate = jsDateToXeroDate(localInvoice.dueDate);
  xeroInvoice.Total = localInvoice.totalPrice + localInvoice.totalTax;
  xeroInvoice.TotalTax = localInvoice.totalTax;
  xeroInvoice.Status = 'AUTHORISED';
  xeroInvoice.LineAmountTypes = 'Inclusive';
  xeroInvoice.LineItems = [];
  xeroInvoice.Contact = {
    ContactID: contactId
  };
  localInvoice.items.forEach(function(item){
    xeroInvoice.LineItems.push({
      Description: item.name,
      Quantity: item.quantity || 1,
      LineAmount: item.price + item.tax,
      AccountCode: 200
    });
  });
  return xeroInvoice;
};


exports.localContactToXeroContact = function(localContact){
  var xeroContact = {};
  if (localContact.xeroContactId){
    xeroContact.ContactID = localContact.xeroContactId;
  }
  xeroContact.ContactNumber  = localContact._id.toString();
  xeroContact.Name  = localContact.companyName;
  xeroContact.FirstName  = localContact.name;
  xeroContact.LastName  = localContact.surname;
  xeroContact.EmailAddress  = localContact.email;
  xeroContact.IsCustomer  = true;
  xeroContact.DefaultCurrency  = "AUD";
  return xeroContact;
};

exports.xeroInvoiceToLocalInvoice = function(xeroInvoice){

};

exports.xeroContactToLocalContact = function(xeroContact){

};

