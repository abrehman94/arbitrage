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

var rate=64.5;
function updateRate(val){
    rate = val;
}
// function getRate(){
//     request({url:"http://www.apilayer.net/api/live?access_key=5fbd254e69b14968334abe792c9b1501",json:true},(err,res,body)=>{
//         if(err){
//             console.log("error with rate");
//         }
//         updateRate(parseFloat(body.quotes.USDINR*10/10));
//     })
// }
// getRate();
// setInterval(getRate,3600000);

var tradeValues = function(theUrl, name,curr,coin){
    return new Promise((resolve,reject)=>{
        request({
            url: "https://quiet-hamlet-43198.herokuapp.com/"+theUrl,
            json: true
        },(error,response,body)=>{
            try{
				if(response.statusCode==200){
                var b_bid;
                var b_ask;
                try{
                    if(name=="coinsecure"){
                        console.log(body.message.bid);
                        b_bid=parseFloat(body.message.bid/100)/rate;
                        b_ask=parseFloat(body.message.ask/100)/rate;
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
                        if(coin==="btc"){
							b_bid=parseFloat(body.result.XXBTZUSD.b[0]);
							b_ask=parseFloat(body.result.XXBTZUSD.a[0]);
						}
						else if(coin==="bch"){
							b_bid=parseFloat(body.result.BCHUSD.b[0]);
							b_ask=parseFloat(body.result.BCHUSD.a[0]);
						}
						else if(coin==="eth"){
							b_bid=parseFloat(body.result.XETHZUSD.b[0]);
							b_ask=parseFloat(body.result.XETHZUSD.a[0]);
						}
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
                    if(curr==="inr" ){
                        tempObj.bid = Math.round(tempObj.bid*rate*10)/10;
                        tempObj.ask = Math.round(tempObj.ask*rate*10)/10;
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
                    console.log(response.statusCode);
					// console.log(body);
					resolve({bid:0000,ask:0000});
					//reject("errorCode"+response.statusCode);
				}
			}
			catch(e){
				console.log("no response");
			}
        }
			);
        }
    )
}

module.exports={tradeValues,rate};
