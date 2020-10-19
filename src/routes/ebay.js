import { Router } from 'express';
import ebayController from '../crawler/controllers/ebayController';
const { check, oneOf } = require('express-validator');

const ebayRouter = new Router();

const updateInterval = ['3', '6', '12'];
const changeDirection = ['increase', 'decrease'];

ebayRouter.route('/')
    .post([
        
            check('link').matches(/(https:\/\/(.+?\.)ebay\.com\.au\/itm(\/[A-Za-z0-9\-\._~:\/\?#%\[\]@!$&'\(\)\*\+,;\=]*)?)/),
            check('update_interval').isIn(updateInterval),
            check('notify_change').exists().isBoolean(),
            check('change_direction').exists().isIn(changeDirection),
            check('change_amount').exists().isFloat()
    ],
    ebayController.addLink);
    
    // .delete([
    //     check('id').isInt(),
    // ],
    // ebayController.deleteLink);

    
export default ebayRouter;