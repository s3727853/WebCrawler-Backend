var Crawler = require("crawler");
import pool from '../db/dbConnection';

const ibanCrawler = {

    async crawlIban() {

        var crawler = new Crawler({
        maxConnections : 10
        });
        
        crawler.direct({
            uri: 'https://www.iban.com/exchange-rates',
            skipEventsRequest: false,
            callback : function (error, response) {
                if(error){
                    console.log(error);
                }else{
                    var $ = response.$;
        
                    // The entire table will be read. However for simplicities sake at this point in time I will only be using 4 currencies.
                    const currencyTable = [];
                    // Cheerio and JQUERY used to select the table from the page and loop through each row and push to array
                    $("body > div.boxed > div.flat-row.flat-general.sidebar-right.pad-top0px > div > div > div.flat-wrapper > div.general.flat-clients > div > table > tbody > tr").each((index, element) =>{
                        const rate = $($(element).find('strong')[0]).text();
                        const code = $($(element).find('img')[0]).attr('alt');
                        const tableRow = { code, rate };
                        currencyTable.push(tableRow);
                
                    })

                    // uncomment the below console.log if you wanto see output from the above code
                    // console.log(currencyTable);

                    try {

                    // This try block should fail if there is a problem reading the table. We assume if the currency code(exists) then the associated exchange rate is valid. 
                    // if the currency code does not exists it will throw the error in the search functions. If rate field does not exist it will throw the error in the
                    // in array assignment. This is not the cleanest way to do this. But the main goal here is to get some of these features up and running quickly.

                    const storedCurrencies = [];

                    // Australian Dollar
                    const aud = currencyTable.find(element => element.code == "AUD");
                    storedCurrencies.push({code : aud.code, rate : aud.rate});
                    // American Dollar
                    const usd = currencyTable.find(element => element.code == "USD"); 
                    storedCurrencies.push({code : usd.code, rate : usd.rate});
                    // English pound 
                    const gbp = currencyTable.find(element => element.code == "GBP");
                    storedCurrencies.push({code : gbp.code, rate : gbp.rate});
                    // New Zealand dollar
                    const nzd = currencyTable.find(element => element.code == "NZD");
                    storedCurrencies.push({code : nzd.code, rate : nzd.rate});
                    //Chinese Yuan
                    const cny = currencyTable.find(element => element.code == "CNY");
                    storedCurrencies.push({code : cny.code, rate : cny.rate});
                    
                    
                    // Call db method and pass in rates

                    console.log("\nRates to be pushed to DB:");
                    storedCurrencies.forEach(element => {
                         console.log(element.code + " " + element.rate)

                        pool.query('SELECT * FROM ibanUpdate($1, $2)', [element.code, element.rate], (err, res) => {
                            if (err){
                                console.log(err)
                            }
                            console.log(res.rows[0])
                        })
                            
                     });
                
                    } catch(error){
                    // THis will need to be more robust later on. for example if currency reads fail 3 times email admin and switch to backup site.
                    console.log(error);
                    } 
                }
            
            }
        });    
    }
};
export default ibanCrawler;






