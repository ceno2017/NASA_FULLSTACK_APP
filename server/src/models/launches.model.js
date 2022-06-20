const launchesDatabase = require('./launches.mongo');
const axios = require('axios');
const planets = require('./planets.mongo');


//const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL ='https://api.spacexdata.com/v4/launches/query';

 async function populateLaunches()
 {
  console.log('Downloading Spacex data...');
  const response = await axios.post(SPACEX_API_URL,
    {
      query: {},
      options: {
        pagination: false,
          populate:[
              {
                  path:'rocket',
                  select:{
                      'name':1
                  }
              },
              {
                path: 'payloads',
                select:{
                  'customers':1
                }
              }
          ]
      },
    });
  if(response.status!==200)
  {
   console.log('Problem downloading new launch');
   throw new Error('Launch data download failed'); 
  }


//axios puts the response in the "data" property of the body of our response
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs)
    {
      const payloads = launchDoc['payloads'];
      const customers = payloads.flatMap(payload =>{
        return payload['customers'];
      });

      const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],
        rocket: launchDoc['rocket']['name'],
        launchDate: launchDoc['date_local'],
        upcoming: launchDoc['upcoming'],
        success: launchDoc['success'],
        customers
      }

      console.log(`${launch.flightNumber}  ${launch.mission}`);

      //TODO: populate launches collection
      await saveLaunch(launch);
    }
 }

async function loadLaunchData()
{
  const firstLaunch =   await findLaunch({
    flightNumber: 1,
    rocket: 'mission 1',
    mission: 'FalconSat'
  });
  if(firstLaunch)
  {
    console.log('Launch already exist');
  }else
  {
   await  populateLaunches();
  }
}
async function getAllLaunches(skip,limit){
   // return Array.from(launches.values());
    return await launchesDatabase
    .find({},{'_id':0, '__v':0 })
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch(launch){
   const planet = await planets.findOne({
     keplerName: launch.target
   });
   if(!planet){

   }
  const newFlightNumber = await getLatestFlight() + 1;

  const newLaunch = Object.assign(launch,{  
    success: true,
    upcoming: true,
    customers: ['WEBPLAN SOFTWARE DEV LTD','NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function  findLaunch(filter){
 return await launchesDatabase.findOne(filter);
}
async function existsLaunchWithId(launchId){
    return await findLaunch({
      flightNumber:launchId
    });
}

async function getLatestFlight(){
 const latestLaunch = await launchesDatabase
  .findOne()
  .sort('-flightNumber');
  //sort with negative flightnumber starts with the highest number to the lowest number
  if(!latestLaunch){
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch)
{
    //1. exposes setOnInsert which reveals we are using mongoDb
    // await launchesDatabase.updateOne({
    // flightNumber: launchesDatabase.flightNumber
    // },launch,{
    //   upsert: true
    // })
    //2. findOneAndUpdate does return only the object needed and not the setOnInsert property 
    await launchesDatabase.findOneAndUpdate({
    flightNumber: launchesDatabase.flightNumber
    },launch,{
      upsert: true
    })
}
async function abortLaunchById(launchId)
{
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId,
  },{
    success: false,
    upcoming: false,
  });

  return aborted.modifiedCount===1;
}

module.exports={
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}