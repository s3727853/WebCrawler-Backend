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
        const queryValues = [req.body.full_name, req.body.email, req.body.password];
        const queryResult = pool.query('SELECT * FROM addUser($1, $2, $3)', queryValues);

        return res.status(200).json((await queryResult).rows);

    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: 'Error creating user'});
    }
    }
};

export default userController;