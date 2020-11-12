import { Router } from 'express';
import ebayController from '../crawler/controllers/ebayController';
import ebayCrawler from '../crawler/ebayCrawler'
const { check } = require('express-validator');

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

ebayRouter.route('/update')
    .put([
            check('link_id').isInt(),
            check('update_interval').isIn(updateInterval)
    ],
    ebayController.updateLink);

ebayRouter.route('/')
        .get(
        ebayController.getItems);
        
ebayRouter.route('/history')
        .get([
                check('link_id').isInt().exists()
        ],
            ebayController.getItemPriceHistory);

ebayRouter.route('/:id')
        .delete([
                check('id').isInt().escape().notEmpty()
        ],
        ebayController.deleteLink);

    
export default ebayRouter;