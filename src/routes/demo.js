import { Router } from 'express';
import demoController from '../controllers/demoController';

const demoRouter = new Router();


// Now this is setup we handle the differnt HTML requests that we need (GET, PUT, DELETE etc)

// for a GET request to the root of this route (api/demo) then call the demoMethod from the demoController 
demoRouter.route('/')
    .get(demoController.demoMethod);

export default demoRouter;