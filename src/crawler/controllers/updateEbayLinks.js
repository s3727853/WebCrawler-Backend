import pool from '../../db/dbConnection';
var Crawler = require("crawler");

const updateEbayLinks = {


    async updateEbayLinks(){
        
        try{
        // Get list of links that are out of date (last_crawled - time now > crawl interval)
        const linksToUpdate = await pool.query("SELECT * FROM getEbayUpdateList()");
        // For each item that needs updating send it to the crawler to update the price

    
        const linkID = [];
        const linksToCrawl = [];
        const linkPrice = [];
        const invalidLinks = [];   
        const updatedLinks = [];

        linksToUpdate.rows.forEach(element => {
            console.log("Updating " + element);
            linksToCrawl.push(element.link);
            
            
            try {
                var crawler = new Crawler({
                    maxConnections : 10
                    });
                    
                    crawler.direct({
                        uri: element.link,
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
                                    linkPrice.push(price);
                                    linkID.push(element.link_id);
                                    //updatedLinks.push({id : element.link_id, price : price});         
                                    updatedLinks.push([element.link_id, parseFloat(price)]);

                                } else {
                                   invalidLinks.push([element.link_id]);
                                   
                                    
                                }

                            }
                            
                        }
                    }) 

        }
        catch(error) {
            console.log(error);
        }  




        });

        const delay = millis => new Promise((resolve, reject) => {
            setTimeout(_ => resolve(), millis)
          });


        // Awaiting crawler to crawl links. This is not a good solution. But for the sake of this
        // project and time constraints it will have to do
        await delay(10000);

        // Now we call 1 database query to update the links passing in an array of the link id and price
        
        if(updatedLinks.length>0){
            pool.query("SELECT * FROM updateEbayPrice($1)", [updatedLinks]);
        }
        // If there were any invalid links change link status to false in DB
        if(invalidLinks.length>0){
            pool.query("SELECT * FROM setEbayLinkStatus($1)", [invalidLinks]);
        }

        console.log("Updated Links:");
        console.log(updatedLinks);
        // console.log(linkID);
        // console.log(linkPrice);
        // console.log("Valid ID's");
        // console.log(linkID);
        // console.log("Invalid ID's");
        // console.log(invalidID);

        } catch(error){
        console.log(error);
        }
    }
}

export default updateEbayLinks;

