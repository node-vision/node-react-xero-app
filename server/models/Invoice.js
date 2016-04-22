'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InvoiceSchema = new Schema({
    name: String,
    contact: {type: mongoose.Schema.Types.ObjectId, ref: 'Contact'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    dueDate:Date,
    paidDate:Date,
    items: [{
        name:String,
        price: {type: Number, default:0},
        quantity:{type: Number, default:0},
        unitPrice: {type: Number, default:0},
        tax: {type: Number, default:0}
    }],
    totalPrice: Number,
    totalTax: Number,
    created:Date,
    xeroContactId: String
}, {
    toObject: {virtuals:true},
    toJSON: {virtuals:true}
});

InvoiceSchema
    .pre('save', function(next) {
        var now = new Date();
        if ( !this.created ) {
            this.created = now;
        }
        next();
    });


module.exports = mongoose.model('Invoice', InvoiceSchema);
