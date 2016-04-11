'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Invoice = require('./../models/Invoice.js');

/**
 * Create a Invoice
 */
exports.create = function(req, res) {
  var invoice = new Invoice(req.body);
  invoice.save(function(err, data) {
    if (err) {
      res.status(501).send();
    } else {
      res.status(200).send(data);
    }
  });
}


/**
 * Update a invoice
 */
exports.update = function(req, res) {
  Invoice.findOne({
    _id: req.body._id
  }, function(err, doc) {
    if (!doc) {
      return res.status(404).send();
    }

    for (var key in req.body) {
      doc[key] = req.body[key];
    }

    doc.save((err, doc) => {
      Invoice.findOne({_id: req.body._id}, (err, doc) => {
        res.status(200).send(doc);
      }).populate('contact');
    });
  });
};

/**
 * Delete a invoice
 */
exports.delete = function(req, res) {
  Invoice.find({
      _id: req.params.id
    })
    .remove(function() {
      res.status(202)
        .send();
    });
};

/**
 * List of Invoice
 */
exports.list = function(req, res) {
  Invoice.find(function(error, doc) {
    res.send(doc);
  }).populate('contact');
};

/**
 * Invoice get by id
 */
exports.read = function(req, res) {
  Invoice.find({
    _id: req.params.id
  }, function(error, doc) {
    if (error) {
      return res.status(404).send();
    }

    res.status(200)
      .send(doc);
  }).populate('contact');
};
