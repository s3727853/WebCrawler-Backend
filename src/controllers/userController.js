import { validationResult, Result } from 'express-validator';
import { contentSecurityPolicy } from 'helmet';
import pool from '../db/dbConnection';

const userController = {

    // Create new user

    async registerUser(req, res){
        const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // problem with input validation
      return res.status(422).jsonp(errors.array());
    }

    try {
        const queryValues = [req.body.first_name, req.body.last_name, req.body.email, req.body.role, req.body.password];
        const queryResult = pool.query('SELECT * FROM addUser($1, $2, $3, $4, $5)', queryValues);

        return res.status(200).json((await queryResult).rows);

    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: 'Error creating user'});
    }
    },

    async updateUser(req, res){
        const errors = validationResult(req);
        const userID = req.user.id;
        var firstName = req.body.first_name;
        var lastName = req.body.last_name;
        var email = req.body.email;

        console.log(req.body.last_name);

        if(!req.body.first_name){
            firstName = req.user.first_name;
        };

        if(!req.body.last_name){
            lastName = req.user.last_name;
        };

        if(!req.body.email){
            email = req.user.email;
        };
        
        const queryValues = [req.user.id, firstName, lastName, email];
        
        if (!errors.isEmpty()) {
            // problem with input validation
            return res.status(422).jsonp(errors.array());
        }
 
        try{
            pool.query("SELECT * FROM updateuser($1,$2,$3,$4)", queryValues);
            return res.status(200).json({message: "Details updated"});
        }catch(error){
            return res.status(400).json({message: "error"});
        }
    }
};

export default userController;