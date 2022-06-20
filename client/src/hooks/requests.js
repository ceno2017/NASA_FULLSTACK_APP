const API_URL = "http://localhost:8000/v1";
  
// Load planets and return as JSON.
async function httpGetPlanets() {
   const response = await fetch(`${API_URL}/planets`);
   return response.json();
}

  // Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
   return response.json();
  //const fetchedLaunches = response.json();
  //  const launchesArr = fetchedLaunches.sort((a,b)=>{
  //   return a.flightNumber - b.flightNumber
  // });
  // return launchesArr;
}

async function httpSubmitLaunch(launch) {
  try
  {
      return await fetch(`${API_URL}/launches`,{
      method:"post",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(launch),
    });
  }catch(error)
  {
     return {
       ok: false,
     }
  }
}

// TODO: Once API is ready.
  // Delete launch with given ID.
async function httpAbortLaunch(id) {
   try{
     //this block of code will always return {ok: true}
   return  await fetch(`${API_URL}/launches/${id}`,{
       method: 'delete',
     });
   }catch(err){
     console.log(err);
     return {
       ok: false,
     }  
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};