import updateEbayLinks from '../controllers/updateEbayLinks';
import pool from '../../db/dbConnection';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: 'postmaster@redbackcrawler.je-it.com',
        pass: process.env.MAIL_PASS
    }
});

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


    async getItemPriceHistory(req, res){
        try{
            const queryValues = [req.query.link_id];
            const queryResult = pool.query("SELECT * FROM ebaylinkhistory WHERE link_id = $1 ORDER BY time_crawled ASC", queryValues);
            return res.status(200).send((await queryResult).rows);

        } catch(error){
            console.log(error);
        }
    },


    // Delete a saved link for signed in user 
    async deleteLink(req, res) {
        const errors = validationResult(req);
        const queryValues = [req.params.id, req.user.id];

        if(!errors.isEmpty()){
            return res.status(422).jsonp(errors.array());
        }

        try{
            console.log("Delete Ebay Link Called");
            console.log("Link ID " + req.params.id);
            console.log("User ID " + req.user.id);
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

    async updateLink(req, res){
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).jsonp(errors.array());
        }
        const queryValues = [req.user.id, req.body.link_id, req.body.update_interval];

        try{
            const queryResult = pool.query("SELECT * FROM updateLink($1,$2,$3)", queryValues);

            if((await queryResult).rows[0].updatelink == "link updated"){
                return res.status(200).json({message : 'Link updated'});
            } else {
                return res.status(400).json({message : 'Error updating link'});
            }
        }catch(error){

        }

    },

    // This checks all links that are set with a notificaton, If the price has falls within a notifcation range send email
    async checkNotifications() {

        // This will hold id's for the notification table. These email notifications settings will be deleted after the emails are sent.
        // If we didn't do the users would get price update emails for the same item every time this method was called.
        const ebayEmailID = [];

        try{
            const queryResult = await pool.query("SELECT * FROM checkEbayNotifications()");
           // console.log(queryResult.rows);

           queryResult.rows.forEach(element => {

                //var userID = element.user_id;
                var linkNotificationID = element.ebayemail_id;
                var name = element.name;
                var email = element.email;
                var currentPrice = element.current_price;
                var notificationPrice = element.notification_amount;
                var initialPrice = element.initial_price;
                var productName = element.product_name;
                var productURL = element.product_link;


                console.log("Hi " + name + " your tracked eBay product has triggerd a price alert.")
                console.log("Product: " + productName + " | CurrentPrice: " + currentPrice + " | Your notifcation limit: " + notificationPrice + " | Initial price: " + initialPrice);
                console.log("Product Link: " + productURL);

                transport.sendMail({
                    from: 'no-reply@redbackcrawler.com', // Sender address that shows in receipents email client
                    to: email, 
                    subject: 'Redback Crawler Price Alert',
                    // Text for clients not supporting html
                    text: `Hi ${name}, \nYour tracked eBay item has triggered a price alert. \nYour item: ${productName} is currently at $${currentPrice}\nThe Redback Crawler Team.`, 
                    // TODO read in the html content from another file. This is disgusting as one line.
                    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, initial-scale=1.0"/><style type="text/css"> .item {border: 1px solid grey; border-collapse: separate; border-radius: 5px; } .item th {border: 1px solid grey; padding: 2px; } .item td {border: 1px solid grey; padding: 2px; } @import url("https://fonts.googleapis.com/css2?family=Alata&amp;display=swap"); th { text-align: left} p { font-family: "Alata", sans-serif; font-weight: 200; font-size: 16px; padding-bottom: 20px; } #footer { font-size: 18px; } body {Margin: 0;padding: 0;}table {border-spacing: 0;}td {padding: 0;}img {border: 0;}@media screen and (max-width: 600px) { }@media screen and (max-width: 400px) { } </style></head> <body class="em_body" style="margin:0px; padding:0px;" bgcolor="#efefef"> <table align="center" width="700" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:700px; "> <tr> <td valign="bottom" align="left"> <div><p>Hi ${name},</p><p>Your tracked eBay item has triggered a price alert.</p><table class="item"><tr><th>Product</th><th style="background-color:#ffebe6;">Current Price</th><th>Initial Price</th><th>Price Trigger</th></tr><tr><td>${productName}</td><td style="font-weight:bold; background-color:#ffebe6">$${currentPrice}</td><td>$${initialPrice}</td><td>$${notificationPrice}</td></tr></table><a href="${productURL}"><p>View on eBay<p></a></div> </td> <tbody><tr> <td valign="bottom" align="left"> <div><p id="footer">The Redback Crawler Team</p> </div> </td> <td valign="bottom" align="right"><img alt="Redback Crawler Logo" style="display:block;"src="https://iili.io/26NfI9.png" width="150" border="0" height="auto"/></td> </tr> </tbody> </tr> </table></body></html>`
                });

            
                ebayEmailID.push([linkNotificationID]);


            });
                

            const delay = millis => new Promise((resolve, reject) => {
                setTimeout(_ => resolve(), millis)
              });
    
            await delay(2000);

            if(ebayEmailID.length>0){
                console.log("Price change emails have been sent, deleteing the notification data")
                console.log(ebayEmailID);
            pool.query("SELECT * FROM deleteEbayNotification($1)", [ebayEmailID]);
            }
    

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

