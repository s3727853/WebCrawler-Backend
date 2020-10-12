import { Router } from 'express';
import adminController from '../controllers/adminController';

const { check } = require('express-validator');

const allowedRoleSort = ['admin', 'user', 'premiumuser'];

const adminRouter = new Router();

adminRouter.route('/users')
    .get([
        check('limit').escape().isInt().optional(),
        check('offset').escape().isInt().optional(),
        check('rolesort').isIn(allowedRoleSort).optional()
      ],
    adminController.getAllUsers);

   
export default adminRouter;