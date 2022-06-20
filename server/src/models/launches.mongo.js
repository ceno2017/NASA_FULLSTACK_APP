const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type:Number,
        required: true,
        default:100,
        min:100,
        max:900
    },
    launchDate: {
        type: Date,   
        required: true
    },
    mission:{
      type: String,
      required: true
    },
    rocket:{
        type: String,
        required: true
      },
    target: { 
        type: String,
        required: true
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }
});

//this should always be the singular name of the collection, mongoose calls this "compiling the model"
module.exports = mongoose.model('Launch',launchesSchema);