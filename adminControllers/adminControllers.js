const mongoose = require('mongoose');


const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }

  
});

const admincollection = mongoose.model('admincollection', newSchema);

module.exports = admincollection;


