import { validationResult, Result } from 'express-validator';
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
        // Trim whitespace from names
        var first_name = req.body.first_name.trim();
        var last_name = req.body.last_name.trim();

        const queryValues = [first_name, last_name, req.body.email, req.body.role, req.body.password];
        const queryResult = pool.query('SELECT * FROM addUser($1, $2, $3, $4, $5)', queryValues);

        return res.status(200).json((await queryResult).rows);

    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: 'Error creating user'});
    }
    },

    async updateUser(req, res){
        const errors = validationResult(req);

        // As this method come via the authenticator we have the users details passed in from the JWT token.
        // The frontend only passes fields it wants updated, whatever are not passed in will be set to the current value
        // for the user.
        var queryValues = [];
        var userID = req.body.user_id.trim();
        var firstName = req.body.first_name.trim();
        var lastName = req.body.last_name.trim();
        var email = req.body.email.trim();
        var role = req.body.role.trim();

        if(!req.body.first_name){
            firstName = '';
        };

        if(!req.body.last_name){
            lastName = '';
        };

        if(!req.body.email){
            email = '';
        };

        if(!req.body.role){
            role = '';
        };

        if(!req.body.user_id){
            userID = req.user.id;
        };

        
        if(req.user.role == "admin"){
            console.log("admin");
            queryValues = [userID, firstName, lastName, email, role];
        } else {
            console.log("User");
            queryValues = [req.user.id, firstName, lastName, email, req.user.role];
            console.log(queryValues);
        }

        if (!errors.isEmpty()) {
            // problem with input validation
            return res.status(422).jsonp(errors.array());
        }
 
        try{
            
            const queryResult = pool.query("SELECT * FROM updateuser($1,$2,$3,$4,$5)", queryValues);
            
            if((await queryResult).rows[0].updateuser == "Email not unique"){
                return res.status(400).json({message: "Email not unique in system"});
            } else {
                return res.status(200).json({message: "Details updated"});
            }

        }catch(error){
            console.log(error);
            return res.status(400).json({message: "error"});
        }
    }
};

export default userController;