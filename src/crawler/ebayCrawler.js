// Price:   $("#prcIsum").text();  

// Price by itself $("#prcIsum").attr("content")
// Currency $("#vi-mskumap-none > span:nth-child(3)").attr("content") !!Not reliable!!

// If auction  $("#bidBtn_btn").attr("data-cta")  will = placebid

var Crawler = require("crawler");
import pool from '../db/dbConnection';
import { validationResult } from 'express-validator';


const ebayCrawler = {

    
    // Ebay product link to crawl is passed in from the controller
    async crawlEbay(req, res) {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).jsonp(errors.array());
        }

    // A regular expression is used to ensure that the link is valid for a ebay product.
    // Ebay product link should begin like this: https://www.ebay.com.au/itm/ -Rest of link here-
    //let ebayREGEX = /(https:\/\/(.+?\.)ebay\.com\.au\/itm(\/[A-Za-z0-9\-\._~:\/\?#%\[\]@!$&'\(\)\*\+,;\=]*)?)/;
    const item = [];
    const ebayLink = req.body.link;
        try {
                var crawler = new Crawler({
                    maxConnections : 10
                    });
                    
                    crawler.direct({
                        uri: ebayLink,
                        skipEventsRequest: false,
                        callback : function (error, response) {
                            if(error){
                                console.log(error);
                            }else{
                                var $ = response.$;
                    
                                // Cheerio and JQUERY used to select the product price, currency type and determine if it is an auction.
                                const itemName = $("#vi-lkhdr-itmTitl").text();
                                const price1 = $("#prcIsum").attr("content");   
                                const price2 = $("#prcIsum_bidPrice").attr("content"); 
                                const isAuction = $("#bidBtn_btn").attr("data-cta");
                                
                                const image = $("#icImg").attr("src");
                                
                                // console.log("Image:");
                                // console.log(image);

                                var price = 0;
                                var auction = false;
                                var invalidLink = false;

                                if(price1 == undefined){ 
                                    var price = price2;
                                } else {
                                    price = price1;
                                }
                                if(price2 == undefined && price1 == undefined) {
                                    invalidLink = true;
                                }
                            
                                // If the listing is an action crawl the end time & date and format it.
                                if(isAuction == "placebid"){
                                    auction = true;

                                    
                                    var date = $("#bb_tlft > span.vi-tm-left > span:nth-child(1)").text();
                                    // "(11 Nov, 2020"
    
                                    var time = $("#bb_tlft > span.vi-tm-left > span:nth-child(2)").text();
                                    // "00:52:16 AEDST)"
    
                                    // Strip extra characters with regex
                                    date = date.replace(/[,\,",()]/g, "");
                                    time = time.replace(/[,\,",(),A-Za-z]/g, "");
                                    
                                    // Convert to a standardised format
                                    var isoDate;
                                    try {
                                        isoDate = new Date(date + " " + time + "UTC");
                                        isoDate = isoDate.toISOString();
                                    } catch(error){
                                        console.log(error);
                                    }
                                    
                                    //console.log("RAW Date time: " + date + " " + time + "UTC");
                                    //console.log("End ISOtoString:" + isoDate);
                                    

                                }
                                // This regex strips any letters and dollar sign from string. Due to some changes on ebays end "u$" was appearing in the price field.
                                price = price.replace(/[A-Za-z,$]/g, '');
                                price = price.trim();
                                
                                
                                try{
                                if(!invalidLink){  
                                    if(req.body.notify_change == "false"){
                                        console.log("notify change = false");
                                        const queryValues = [req.user.id, req.body.link, itemName, price, req.body.update_interval, "false", "false", "0", image, isoDate];
                                        const queryResult = pool.query("SELECT * FROM addEbayItem($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", queryValues);
                                        return res.status(200).jsonp({name : itemName, price : price, isAuction : auction, user : req.user.id});
                                        
                                    }
                                    if(req.body.notify_change == "true"){
                                        console.log("notify change = true");
                                        const queryValues = [req.user.id, req.body.link, itemName, price, req.body.update_interval, 
                                            req.body.notify_change, req.body.price_increase, req.body.change_amount, image, isoDate];
                                        const queryResult = pool.query("SELECT * FROM addEbayItem($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", queryValues);
                                        return res.status(200).jsonp({name : itemName, price : price, isAuction : auction, user : req.user.id});
                                    }
                                } 

                                } catch(error){
                                    return res.status(400).send({ message: 'Ebay link may not be valid, or system could not parse it'});
                                }

                            }
                            
                        }
                    }) 

        }
        catch(error) {
            console.log(error);
        }  

    }
    
    
};
export default ebayCrawler;






