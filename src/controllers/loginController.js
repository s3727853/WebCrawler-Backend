import jwtConfig from '../config/jwtConfig';
import pool from '../db/dbConnection';
import { validationResult, Result } from 'express-validator';
import jwt from 'jsonwebtoken';


const loginController = {

    // Login the user, generate and send back the token

    async login(req, res){
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            // if true there are input validation errors, return them to caller
            return res.status(422).jsonp(errors.array());
        }

        try {
            const queryValues = [req.body.email, req.body.password];
            const queryResult = await pool.query('SELECT * FROM getUser($1, $2)', queryValues);

            if (queryResult.rows == 0 ){
                return res.status(401).jsonp({ message: 'Bad username or password'});
            }
            
            
            const payload = {
                id: queryResult.rows[0].id,
                first_name: queryResult.rows[0].first_name,
                last_name: queryResult.rows[0].last_name,
                email: queryResult.rows[0].email,
                role: queryResult.rows[0].role
            };

            const token = jwt.sign(payload, jwtConfig.jwtSecret, {
                expiresIn: jwtConfig.tokenExpireTime
            });

            return res.status(200).send({ access_token: `${token}`});

        } catch (error) {
            console.log(error);
            return res.status(400).send({ message: 'Error contacting database'});
        }
    }
};

export default loginController;