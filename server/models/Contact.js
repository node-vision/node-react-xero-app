'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContactSchema = new Schema({
    name: String,
    companyName:String,
    email: { type: String, lowercase: true },
    surname: String,
    phone: String,
    created: Date,
    modified: Date,
    address: String
});

ContactSchema
    .pre('save', function(next) {
        var now = new Date();
        this.modified = now;
        if ( !this.created ) {
            this.created = now;
        }
        next();
    });

module.exports = mongoose.model('Contact', ContactSchema, 'contacts');
