import { Router } from 'express';
import demoController from '../controllers/demoController';

const authDemo = new Router();


// Now this is setup we handle the differnt HTML requests that we need (GET, PUT, DELETE etc)

// for a GET request to the root of this route (api/demo) then call the demoMethod from the demoController 
authDemo.route('/')
    .post(demoController.authDemo);

export default authDemo;