let mongoose = require('mongoose');
var uri = process.env.MONGOLAB_URI || 'mongodb://localhost/node-xero-app';
var db = mongoose.connect(uri,function(){
	require('./seed.js');
});

module.exports = db;
