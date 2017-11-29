// var url1 = "https://api.coinsecure.in/v1/exchange/ticker";
// //message.bid message.ask

// var url2 = "http://koinex.in/api/ticker";
// //stats.BTC.highest_bid stats.BTC.lowest_ask
// var url3 = "https://bitbay.net/API/Public/btcUSD/ticker.json";
// //bid ask
// var url4 = "https://api.bitfinex.com/v1/pubticker/btcusd";
// //bid ask

// var url5 = "https://api.kraken.com/0/public/Ticker?pair=XBTUSD";
// //result.XXBTZUSD.b[0]  result.XXBTZUSD.a[0]

// var url6 = "https://cex.io/api/ticker/BTC/USD";
// //bid ask



var request = require("request");
var tradeValues = function(theUrl, name){
    return new Promise((resolve,reject)=>{
        request({
            url: theUrl,
            json: true
        },(error,response,body)=>{
            if(response.statusCode==200){
                var b_bid;
                var b_ask;
                try{
                    if(name=="coinsecure"){
                        b_bid=parseFloat(body.message.bid/10000);
                        b_ask=parseFloat(body.message.ask/10000);
                    }
                    else if(name=="koinex"){
                        b_bid=parseFloat(body.stats.BTC.highest_bid);
                        b_ask=parseFloat(body.stats.BTC.lowest_ask);
                    }
                    else if(name=="bitbay"){
                        b_bid=parseFloat(body.bid);
                        b_ask=parseFloat(body.ask);
                    }
                    else if(name=="bitfinex"){
                        b_bid=parseFloat(body.bid);
                        b_ask=parseFloat(body.ask);
                    }
                    else if(name=="kraken"){
                        b_bid=parseFloat(body.result.XXBTZUSD.b[0]);
                        b_ask=parseFloat(body.result.XXBTZUSD.a[0]);
                    }
                    else if(name=="cex.io"){
                        
                        b_bid=parseFloat(body.bid);
                        b_ask=parseFloat(body.ask);
                    }
                    else{
                        reject(name+" is not valid");
                    }
                    
                    var tempObj={
                        bid: Math.round(b_bid*10)/10,
                        ask: Math.round(b_ask*10)/10
                    } 
                    resolve(tempObj);

                }
                catch(error){
                    console.log("error");
                    resolve({bid:0000,ask:0000});
                }
                
            }
            else if(error){
                resolve({bid:0000,ask:0000});
            }
            else{
                console.log(name,"unavailable");
                // console.log(body);
                resolve({bid:0000,ask:0000});
                //reject("errorCode"+response.statusCode);
            }
        });
        }
    )
}
module.exports=tradeValues;