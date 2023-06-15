const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim:true
  },
  companyName: {
    type: String,
    required: true,
    trim:true
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  contactNumber: {
    type: String,
    required: true,
  },
  GSTNumber: {
    type: String,
    required: true,
  },
  requireService: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  orderValue: {
    type: String,
    required: true,
  },
  profile:{
    type: String,
    required: true,
  }
 
});

module.exports = mongoose.model('user', userSchema);
