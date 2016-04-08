'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Contact = require('./../models/Contact.js');

/**
 * Create a Contact
 */
exports.create = function(req, res) {
  var contact = new Contact(req.body);
  contact.save(function(err, data) {
    if (err) {
      res.status(501).send();
    } else {
      res.status(200).send(data);
    }
  });
}


/**
 * Update a contact
 */
exports.update = function(req, res) {
  //implement update
  Contact.findOne({
    _id: req.body._id
  }, function(err, doc) {
    if (!doc) {
      return res.status(404).send();
    }

    for (var key in req.body) {
      doc[key] = req.body[key];
    };
    doc.save();
    res.status(200).send(doc);
  });
};

/**
 * Delete a contact
 */
exports.delete = function(req, res) {
  Contact.find({
      _id: req.params.id
    })
    .remove(function() {
      res.status(202)
        .send();
    });
};

/**
 * List of Contact
 */
exports.list = function(req, res) {
  Contact.find(function(error, doc) {
    res.send(doc);
  })
};

/**
 * Contact get by id
 */
exports.read = function(req, res) {
  Contact.find({
    _id: req.params.id
  }, function(error, doc) {
    if (error) {
      return res.status(404).send();
    }

    res.status(200)
      .send(doc);
  })
};
