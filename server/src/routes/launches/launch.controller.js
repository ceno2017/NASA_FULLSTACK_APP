const {getAllLaunches,scheduleNewLaunch,existsLaunchWithId,abortLaunchById} = require('../../models/launches.model');

const {getPagination} = require('../../services/query');

async function httpGetAllLaunches(req,res){
  const {skip, limit} = getPagination(req.query);
  const launches = await getAllLaunches(skip,limit);
  
  return res.status(200).json(launches);
}

async function httpAddNewLaunches(req,res)
{
  const launch = req.body;

//validation
  if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target)
  {
    return res.status(400).json({
        error: 'Missing required launch property'
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  // JS Date object validation
  if(isNaN(launch.launchDate))
  {
   return  res.status(400).json({
        error:'Invalid Date submitted'
    });
  }
  
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch (req,res)
{
  //req.params.id comes back as a string
  const launchId = Number(req.params.id);

  const existLaunch= await existsLaunchWithId(launchId);
  if(!existLaunch)
  {
    return res.status(400).json({
        error: 'Launch not found',
    });
  }

  //if launch does exist
  const aborted = await abortLaunchById(launchId);
  if(!aborted){
    return res.status(400).json({
      error: 'Launch has not been aborted',
      ok: false,
    });
  }
  return res.status(200).json({
    ok: true,
  });
  
}

module.exports = {httpGetAllLaunches,httpAddNewLaunches, httpAbortLaunch};