var Crawler = require("crawler");
import pool from '../db/dbConnection';

const ibanCrawler = {

    async crawlIban() {
        const storedCurrencies = [];

        try {
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

                    
                    // Australian Dollar
                    const aud = currencyTable.find(element => element.code == "AUD");
                    storedCurrencies.push([aud.code, aud.rate]);
                    // American Dollar
                    const usd = currencyTable.find(element => element.code == "USD"); 
                    storedCurrencies.push([usd.code, usd.rate]);
                    // English pound 
                    const gbp = currencyTable.find(element => element.code == "GBP");
                    storedCurrencies.push([gbp.code, gbp.rate]);
                    // New Zealand dollar
                    const nzd = currencyTable.find(element => element.code == "NZD");
                    storedCurrencies.push([nzd.code, nzd.rate]);
                    //Chinese Yuan
                    const cny = currencyTable.find(element => element.code == "CNY");
                    storedCurrencies.push([cny.code, cny.rate]);                
                
                }
            
            }
        })   
    } catch(error){
        console.log(error);
    }

    const delay = millis => new Promise((resolve, reject) => {
        setTimeout(_ => resolve(), millis)
      });

    // Awaiting crawler to crawl links. This is not a good solution. But for the sake of this
    // project and time constraints it will have to do
    await delay(10000);

    console.log("Currency Array to be pushed to DB:");
    console.log(storedCurrencies);
    pool.query("SELECT * FROM ibanUpdate($1)", [storedCurrencies]);


    }   
};

export default ibanCrawler;

