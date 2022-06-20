const express = require('express');
const {httpGetAllLaunches,httpAddNewLaunches,httpAbortLaunch} = require('./launch.controller')

const launchesRouter = express.Router();

//http method post and get
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/',httpAddNewLaunches);
launchesRouter.delete('/:id',httpAbortLaunch);

module.exports= launchesRouter;