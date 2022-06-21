const request = require('supertest');
const app = require('../../app');

const {mongooseConnect,
    mongooseDisconnect,
} = require('../../services/mongo');

const {loadPlanetsData} = require('../../models/planets.model');


describe('LAUNCHES API TEST',()=>{
    beforeAll( async ()=>{
        await mongooseConnect();
        await loadPlanetsData();
    });
    afterAll(async ()=>{
        await mongooseDisconnect();
    });
// we should disconnect from our mongo servcie so that the connection does not stick around forever.
// the tests we are running could be called integrated test or end-to-end test because
// they test real life situations


    describe('Test GET/launches',()=>{
        test('It should respond with 200 success',async ()=>{
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        });
       });
    
    describe('Test POST/launch',()=>{
    const completeLaunchData = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-452 b',
        launchDate:'January 4, 2028'
    }
    const launchDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-452 b',
    }
    
    const launchDataWithInCorrectDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-452 b',
        launchDate:'twelveHertz'
    }
    
        test('It should respond with 201 created',async ()=>{
           const response = await request(app)
           .post('/v1/launches')
           .send(completeLaunchData)
           .expect('Content-Type', /json/)
            .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
    
            expect(requestDate).toBe(responseDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
        test('It should catch missing required properties',async ()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
             .expect(400);
    
          expect(response.body).toStrictEqual({
            error: 'Missing required launch property'
          });
    
        });
        test('It should catch invalid dates',async ()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInCorrectDate)
            .expect('Content-Type', /json/)
             .expect(400);
    
            expect(response.body).toStrictEqual({
                error:'Invalid Date submitted'
            })
        });
    })
});
// describe('Test GET/launches',()=>{
//  test('It should respond with 200 success',async ()=>{
//      const response = await request(app).get('/launches');
//      expect(response.statusCode).toBe(200);
//  });
// });


