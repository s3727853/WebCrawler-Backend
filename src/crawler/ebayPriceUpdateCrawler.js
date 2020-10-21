var Crawler = require("crawler");
import pool from '../db/dbConnection';
import { validationResult } from 'express-validator';

const ebayPriceUpdateCrawler = {

    
    // Ebay product link to crawl is passed in
    async crawlEbay(req) {
    const ebayLink = req.link;
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
                    
                                const price1 = $("#prcIsum").attr("content");   
                                const price2 = $("#prcIsum_bidPrice").attr("content"); 

                                var price = 0;
                                var invalidLink = false;

                                if(price1 == undefined){ 
                                    var price = price2;
                                } else {
                                    price = price1;
                                }
                                if(price2 == undefined && price1 == undefined) {
                                    invalidLink = true;
                                }
                
                                if(!invalidLink){  
                                    const queryValues = [req.link_id, price];
                                    const queryResult = pool.query("SELECT * FROM updateEbayPrice($1, $2)", queryValues);
                                    
                                } else {
                                    const queryValues = [req.link_id];
                                    const queryResult = pool.query("UPDATE ebaylinks SET link_valid = 'FALSE' WHERE id=$1", queryValues);
                                    console.log('Ebay link no longer valid. It may have expired');
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
export default ebayPriceUpdateCrawler;






