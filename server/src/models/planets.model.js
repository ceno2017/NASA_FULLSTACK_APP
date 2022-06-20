const {parse} = require('csv-parse');

const fs = require('fs');
const path = require('path');
const planets = require('./planets.mongo');

function loadPlanetsData(){
       return new Promise((resolve,reject)=>{

        const isPlanetHabitable = (planet)=>{
        return planet['koi_disposition']==='CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6;
        }
        fs.createReadStream(path.join(__dirname,'..','data','kepler_data.csv'))
        .pipe(parse({
            comment:'#',
            columns: true
        }))
        .on('data',(data)=>{
            if(isPlanetHabitable(data)){
                //habitablePlanets.push(data);upsert operation= insert + update
            //    await planets.create({
            //        keplerName: data.kepler_name
            //    });
              saveplanet(data);
            }
        })
        .on('error',(err)=>{
            console.log(err);
            reject(err);
        })
        .on('end',async ()=>{
            const countPlanetSFound = (await getAllPlanets()).length;
            console.log(`${countPlanetSFound} is the number of habitable planets found`);
            resolve();
        });
    });

}

//mongoose operations is asynchronous
// async function  getAllPlanets(){
//     return await planets.find({
//         keplerName: 'Kepler-62 f'
//     },'-keplerName anotherName');
// }


async function saveplanet(planet){
    try{
        //first argument is the object we are finding,if it does not exist, then the second object is inserted
        //but if it does exist we update that document with whatever is in that second object
        //by default the updateOne function with 2 args will only update if the the third argument 
        //does not exist it won t do anything
        await planets.updateOne({
            keplerName: planet.kepler_name
        },
        {
         keplerName: planet.kepler_name
        },
        {
            upsert:true,
        }
        );
    }catch(err){
        console.log(`Could not save a planet${err}`);
    }
}
async function  getAllPlanets(){
    return await planets.find({},{'_id':0,'__v':0});
}


 module.exports = {
    getAllPlanets,
     loadPlanetsData
 }