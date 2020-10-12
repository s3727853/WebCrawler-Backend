import { Router } from 'express';
import { check } from 'express-validator';
import passwordController from '../controllers/passwordController';

const resetPassRouter = new Router();

resetPassRouter.route('/')

  .post([
    check('first_name').not().isEmpty().withMessage('Name must not be empty').escape(),
    check('last_name').not().isEmpty().withMessage('Name must not be empty').escape(),
    check('email').isEmail().normalizeEmail(),
  ],
  passwordController.resetPass);

export default resetPassRouter;