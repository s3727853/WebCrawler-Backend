import { Router } from 'express';
import { check } from 'express-validator';
import passwordController from '../controllers/passwordController';

const updatePassRouter = new Router();

updatePassRouter.route('/')

  .put([
    check('new_password', 'Password min lenght 5 characters').not().isEmpty().isLength({ min: 5}),
  ],
    passwordController.updatePassword);

export default updatePassRouter;