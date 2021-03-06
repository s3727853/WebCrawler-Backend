import { Router } from 'express';
import userController from '../controllers/userController';

const { check } = require('express-validator');

const newUserRouter = new Router();

newUserRouter.route('/')
    // Run some input validation
    .post([
        check('first_name').not().isEmpty().withMessage('Name must not be emtpy').escape(),
        check('last_name').not().isEmpty().withMessage('Name must not be emtpy').escape(),
        check('role').not().isEmpty().withMessage('Role must not be emtpy').escape(),
        check('email').isEmail().normalizeEmail(),
        check('password', 'Password min length must be 5 characters').not().isEmpty().isLength({ min: 5})
    ],
    userController.registerUser);

export default newUserRouter;