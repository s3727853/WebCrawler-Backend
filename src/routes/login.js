import { Router } from 'express';
import loginController from '../controllers/loginController';

const { check } = require('express-validator');

const loginRouter = new Router();

loginRouter.route('/')
    // Run some input validation
    .post([
        check('email').isEmail().normalizeEmail(),
        check('password', 'Password min lenght 5 characters').not().isEmpty().isLength({ min: 5}),
    ],
    loginController.login);

export default loginRouter;