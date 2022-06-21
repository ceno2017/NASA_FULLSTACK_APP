const http = require('http');
//call dotenv library above all your local imports...should not shared on github thus keeping 
//our configuratn separate from our source code
require('dotenv').config();

const app = require('./app');
const {mongooseConnect} = require('./services/mongo.js');
const {loadPlanetsData} = require('./models/planets.model');
const{loadLaunchData} = require('./models/launches.model');

const PORT = process.env.PORT || 8000;



const server = http.createServer(app);


async function startServer ()
{
    await mongooseConnect();
    await loadPlanetsData();
    await loadLaunchData();
    server.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`);
    });
}
startServer();





