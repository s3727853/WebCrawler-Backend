import { Router } from 'express';
import userController from '../controllers/userController';

const { check } = require('express-validator');

const usersRouter = new Router();

usersRouter.route('/')
    // Run some input validation
    .put([
        check('first_name').not().isEmpty().withMessage('Name must not be emtpy').escape().optional(),
        check('last_name').not().isEmpty().withMessage('Name must not be emtpy').escape().optional(),
        check('email').isEmail().normalizeEmail().optional(),
        
    ],
    userController.updateUser);

export default usersRouter;