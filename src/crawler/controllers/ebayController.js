import ebayCrawler from '../ebayCrawler';
import pool from '../../db/dbConnection';
import { validationResult } from 'express-validator';

const ebayController = {

    // Add a new ebay link to signed in users account
    async addLink(req, res) {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).jsonp(errors.array());
        }
       

        ebayCrawler.crawlEbay({link : req.body.link, update : true});
        

        try {
            

            //console.log(crawledItem);

            // const ebayItemValues = [req.user.id, req.body.link,]
            // if(!req.body.notify_change){
            //     const queryResult = await pool.query("");
            // }

            // console.log(req.body.link + " \n" + req.body.update_interval + " " + req.body.notify_change + " " +
            //             req.body.change_direction + " " + req.body.change_amount);
            // console.log("User ID: " + req.user.id);

            // If link is valid and crawler gets valid results add it to ebayLinks table
            // 
            // VALUES()"

        } catch(error) {
            console.log(error);
        }
    },

    async processLink(req){

        try{

            console.log("In EBAY Controller processlink Methdo:");
            console.log(req);

        } catch(error){
            console.log(error);
        }

    },

    // Delete a saved link for signed in user
    async deleteLink(req, res) {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).jsonp(errros.array());
        }

        try{

        } catch(error){
            console.log(error);
        }
    },


    // Check the age of links and if they are older than their update interval re crawl them (update)
    async checkAge() {
        try{

        } catch(error){
            console.log(error);
        }
    }
}

export default ebayController;