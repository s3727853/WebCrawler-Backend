import updateEbayLinks from '../controllers/updateEbayLinks';
import pool from '../../db/dbConnection';
import { validationResult } from 'express-validator';

const ebayController = {

    // Get the ebay items that the user has assigned to their accoutn.

    async getItems(req, res) {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).jsonp(errors.array());
        }
 
        try {
            const queryValues = [req.user.id];
            const queryResult = pool.query("SELECT * FROM ebaylinks WHERE user_id = $1", queryValues);
            return res.status(200).send((await queryResult).rows);
        } catch(error) {
            console.log(error);
        }
    },

    // TODO
    async getItemPriceHistory(req, res){
        try{
            const queryValues = [req.query.link_id];
            const queryResult = pool.query("SELECT * FROM ebaylinkhistory WHERE link_id = $1", queryValues);
            return res.status(200).send((await queryResult).rows);

        } catch(error){
            console.log(error);
        }
    },


    // TODO
    // Delete a saved link for signed in user 
    async deleteLink(req, res) {
        const errors = validationResult(req);
        const queryValues = [req.body.link_id, req.user.id];
        console.log("Link ID = " + req.body.link_id + " User ID = " + req.user.id);

        if(!errors.isEmpty()){
            return res.status(422).jsonp(errors.array());
        }

        try{

            const queryResult = pool.query("SELECT * FROM deleteEbayLink($1,$2)", queryValues);

            if((await queryResult).rows[0].deleteebaylink == 'link deleted'){
                return res.status(200).json({message : 'Link deleted'});
            }
            else {
                return res.status(404).send({message: 'Link not found for current user'});
            }


        } catch(error){
            console.log(error);
        }
    },

    // This checks all links that are set with a notificaton, If the price has falls within a notifcation range send email
    async checkNotifications() {
        try{
            const queryResult = await pool.query("SELECT * FROM checkEbayNotifications()");
            console.log(queryResult.rows);
            
            // TODO Send email to user.
            // rows are only returned for items that meet the notification constraint set by user therfor all rows returned from
            // this method need an email sent.

        } catch(error){
            console.log(error);
        }
    },

    // Check the age of links and if they are older than their update interval re crawl them (update)
    async checkAge() {
        try{
            updateEbayLinks.updateEbayLinks();

        } catch(error){
            console.log(error);
        }
    }
}

export default ebayController;

// Need a function to check call checkEbayNotifications to