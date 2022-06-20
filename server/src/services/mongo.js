//services that will be available for the life cycle of this server will be in this file
const mongoose = require('mongoose');

require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

//mongoose is an object that exposes a property called "connection",which is
//an event emitter
mongoose.connection.once('open',()=>{
    console.log('MongoDb connection ready!');
});

mongoose.connection.on('error',(err)=>{
    console.log(err)
});

async function mongooseConnect(){
     //mongoose returns a promise
     await mongoose.connect(MONGO_URL);
}

async function mongooseDisconnect(){
    await mongoose.disconnect();
}

module.exports ={
    mongooseConnect,
    mongooseDisconnect,
}