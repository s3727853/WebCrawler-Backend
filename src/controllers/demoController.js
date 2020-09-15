// Import the database connection pool for use 
import pool from '../db/dbConnection';

const demoController = {

    async demoMethod(req, res) {
        try {
            // set the DB query. 
            // If we were to use a custom PostgreSQL method I would the method and pass the values to it instead of the manual SQL query
            const databaseQuery = pool.query('SELECT * FROM demo_table');
            
            // Return the resuls from query as a JSON object as well as a HTML status code (200 OK)
            return res.status(200).json((await databaseQuery).rows);
            
        } catch(err) {
            // Normally a error catch block would return a status code such as a 400 or 408
            console.error(err);
        }
    }
};

export default demoController;