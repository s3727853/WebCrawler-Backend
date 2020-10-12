import { validationResult } from 'express-validator';
import pool from '../db/dbConnection';

const adminController = {

    async getAllUsers(req, res){
        //user must be admin
        if(req.user.role != "admin"){
            return res.status(403).send({ message: 'Access denied Admin only' });
        }
        const errors = validationResult(req);
        const limit = req.query.limit || 100;
        const offset = req.query.offset || 0;
        const rolesort = req.query.rolesort || null;
        const queryValues = [Number(limit), Number(offset)];

        if (!errors.isEmpty){
            return res.status(422).jsonp(errors.array());
        }
        try {
        
            if(!rolesort){
                const queryResult = pool.query('SELECT * FROM getUsers($1, $2)', queryValues);
                return res.status(200).json((await queryResult).rows);
             }
            if(rolesort){
                const queryValues = [Number(limit), Number(offset), req.query.rolesort];
                const queryResult = pool.query('SELECT * FROM getUsers($1, $2, $3)', queryValues);
                return res.status(200).json((await queryResult).rows);
            
             }
        } catch (err) {
            console.log(err);
        }
    },
};

export default adminController;