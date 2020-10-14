// Price:   $("#prcIsum").text();  

// Price by itself $("#prcIsum").attr("content")
// Currency $("#vi-mskumap-none > span:nth-child(3)").attr("content") !!Not reliable!!

// If auction  $("#bidBtn_btn").attr("data-cta")  will = placebid

var Crawler = require("crawler");
import pool from '../db/dbConnection';

const ebayCrawler = {

    // Ebay product link to crawl is passed in from the controller
    async crawlEbay(req) {

    // A regular expression is used to ensure that the link is valid for a ebay product.
    // Ebay product link should begin like this: https://www.ebay.com.au/itm/ -Rest of link here-
    let ebayREGEX = /(https:\/\/(.+?\.)ebay\.com\.au\/itm(\/[A-Za-z0-9\-\._~:\/\?#%\[\]@!$&'\(\)\*\+,;\=]*)?)/;
    const ebayLink = req;

        try {
            if(ebayREGEX.test(ebayLink)){

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
                    
                                const productTable = [];
                                // Cheerio and JQUERY used to select the product price, currency type and determine if it is an auction.
                                const itemName = $("#vi-lkhdr-itmTitl").text();
                                const price1 = $("#prcIsum").attr("content");   
                                const price2 = $("#prcIsum_bidPrice").attr("content"); 
                                const price = price1 ? price1 : price2; 
                                //const currency = $("#vi-mskumap-none > span:nth-child(3)").attr("content");
                                const isAuction = $("#bidBtn_btn").attr("data-cta") ? true : false; 
                                console.log("Item: " + itemName + " Price $" + price + " Auction: " + isAuction);
                               // currencyTable.push(tableRow);
                            }
                        }
                    })

            } else {
                console.log("Not a valid ebay link");
            }
        }
        catch(error) {
            console.log(error);
        }
    }
    
       
};
export default ebayCrawler;






