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
                            
                                if(isAuction == "placebid"){
                                    auction = true;
                                }
                                
                                
                                if(!invalidLink){  
                                    const queryValues = [req.user.id, req.body.link, itemName, price, req.body.update_interval];
                                    const queryResult = pool.query("SELECT * FROM addEbayItem($1, $2, $3, $4, $5)", queryValues);
                                    return res.status(200).jsonp({name : itemName, price : price, isAuction : auction, user : req.user.id});

                                } else {
                                    return res.status(400).send({ message: 'Ebay link no longer valid. It may have expired'});
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






