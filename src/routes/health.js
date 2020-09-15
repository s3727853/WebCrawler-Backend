import { Router } from 'express';
import healthController from '../controllers/healthController';

const healthRouter = new Router();

healthRouter.route('/')
  .get(healthController.getHealth);

export default healthRouter;
