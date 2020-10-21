import { Router } from 'express';
import ebayController from '../crawler/controllers/ebayController';
import ebayCrawler from '../crawler/ebayCrawler'
const { check, oneOf } = require('express-validator');

const ebayRouter = new Router();

const updateInterval = ['3', '6', '12'];


ebayRouter.route('/')
    .post([
        
            check('link').matches(/(https:\/\/(.+?\.)ebay\.com\.au\/itm(\/[A-Za-z0-9\-\._~:\/\?#%\[\]@!$&'\(\)\*\+,;\=]*)?)/),
            check('update_interval').isIn(updateInterval),
            check('notify_change').isBoolean().optional(),
            check('price_increase').isBoolean().optional(),
            check('change_amount').isFloat().optional()
    ],
    ebayCrawler.crawlEbay);
    //ebayController.addLink);
    
    // .delete([
    //     check('id').isInt(),
    // ],
    // ebayController.deleteLink);

ebayRouter.route('/')
        .get(
        ebayController.getItems);
        
ebayRouter.route('/history')
        .get([
                check('link_id').isInt().exists()
        ],
            ebayController.getItemPriceHistory);
    
export default ebayRouter;