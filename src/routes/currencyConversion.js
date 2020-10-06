import { Router } from 'express';
import currencyController from '../crawler/controllers/currencyController';
const { check } = require('express-validator');

const currencyRouter = new Router();

currencyRouter.route('/')
    // Run some input validation
    .get([
        check('amount').notEmpty(),
        check('from').notEmpty(),
        check('to').notEmpty()
    ],
    currencyController.convertCurrency);

export default currencyRouter;