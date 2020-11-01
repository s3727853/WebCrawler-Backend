import ibanCrawler from '../ibanCrawler';
import pool from '../../db/dbConnection';
import { validationResult } from 'express-validator';

const currencyController = {

    async convertCurrency(req, res) {
       const errors = validationResult(req);
       const values = [req.query.amount, req.query.from, req.query.to];

       if(!errors.isEmpty()){
           return res.status(422).jsonp(errors.array());
       }
       try {
           // Send to DB method for conversion
           const result = pool.query('SELECT * FROM convertIban($1, $2, $3)', values);

           if(!(await result).rows.isEmpty){
                return res.status(200).json(parseFloat((await result).rows[0].convertiban).toFixed(2));
           } else {
            return res.status(400).send({ message: 'Error with conversion'});
           }
       } catch(error) {
           console.log(error);
       }
    },

    
    async updateCurrencyData() {
        try {
            // Call the crawler which will update the database currency table
            await ibanCrawler.crawlIban();
        } catch (error) {
            console.log(error)
        }   
    },

    async getHistory(req, res){
        try{
            const result = pool.query("SELECT * FROM ibanhistory");
            return res.status(200).json((await result).rows);

        } catch(error){
            console.log(error);
        }
    }
    
}

export default currencyController;

// Note to self(Jack): Can check data age in seconds with 'SELECT EXTRACT(EPOCH FROM (now() - last_updated)) FROM ibanrates WHERE last_updated IS NOT NULL;'