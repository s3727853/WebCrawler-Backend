var Crawler = require("crawler");
const { JSONCookies } = require("cookie-parser");
const { json } = require("body-parser");


var crawler = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
   
        const currencyTable = [];

        $("body > div.boxed > div.flat-row.flat-general.sidebar-right.pad-top0px > div > div > div.flat-wrapper > div.general.flat-clients > div > table > tbody > tr").each((index, element) =>{
            const rate = $($(element).find('strong')[0]).text();
            const code = $($(element).find('img')[0]).attr('alt');
            const tableRow = { code, rate };
            currencyTable.push(tableRow);
        })

        console.log(currencyTable);
          
        }
        done();
    }
});

    function start(){
        crawler.queue('https://www.iban.com/exchange-rates');
    }


module.exports.start = start;






