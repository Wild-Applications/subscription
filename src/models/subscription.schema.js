var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  owner: { type : Number, required : true, index: true, unique: true},
  fee: { type: Number, required: true, default: 200}
}, {
  timestamps: true
});


module.exports = mongoose.model('Subscription', schema);
