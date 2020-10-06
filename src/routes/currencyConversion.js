import { Router } from 'express';
import currencyController from '../crawler/controllers/currencyController';
const { check } = require('express-validator');

const currencyRouter = new Router();

const allowedCurrencies = ['AUD', 'USD', 'GBP', 'NZD'];

currencyRouter.route('/')
    // Run some input validation
    .get([
        check('amount').notEmpty().isFloat(),
        check('from').isIn(allowedCurrencies),
        check('to').isIn(allowedCurrencies)
    ],
    currencyController.convertCurrency);

export default currencyRouter;