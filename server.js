const express = require("express");
const http = require("http");
const path = require("path");
const publicPath = path.join(__dirname+"/public");
const port = process.env.PORT || 4000;
var app = express();
var tradeValues = require("./trades/trade.js");
var server = http.createServer(app);


var url1 = "https://api.coinsecure.in/v1/exchange/ticker";
var url2 = "http://koinex.in/api/ticker";
var url3 = "https://bitbay.net/API/Public/btcUSD/ticker.json";
var url4 = "https://api.bitfinex.com/v1/pubticker/btcusd";
var url5 = "https://api.kraken.com/0/public/Ticker?pair=XBTUSD";
var url6 = "https://cex.io/api/ticker/BTC/USD";


console.log(publicPath);
app.use(express.static(publicPath));

app.get("/getDataCoinsecure", function(req,res){
    tradeValues(url1,"coinsecure")
    .then((data)=>{
        res.send({
            buy: data.bid,
            sell: data.ask
        });
    }, (err)=>{
        console.log(err);
    })

})

app.get("/getDataKoinex", function(req,res){
    tradeValues(url2,"koinex")
    .then((data)=>{
        res.send({
            buy: data.bid,
            sell: data.ask
        });
    }, (err)=>{
        console.log(err);
    })

})

app.get("/getDataBitbay", function(req,res){
    tradeValues(url3,"bitbay")
    .then((data)=>{
        res.send({
            buy: data.bid,
            sell: data.ask
        });
    }, (err)=>{
        console.log(err);
    })

})


app.get("/getDataBitfinex", function(req,res){
    tradeValues(url4,"bitfinex")
    .then((data)=>{
        res.send({
            buy: data.bid,
            sell: data.ask
        });
    }, (err)=>{
        console.log(err);
    })

})


app.get("/getDataKraken", function(req,res){
    tradeValues(url5,"kraken")
    .then((data)=>{
        res.send({
            buy: data.bid,
            sell: data.ask
        });
    }, (err)=>{
        console.log(err);
    })

})


app.get("/getDataCex", function(req,res){
    tradeValues(url6,"cex.io")
    .then((data)=>{
        res.send({
            buy: data.bid,
            sell: data.ask
        });
    }, (err)=>{
        console.log(err);
    })

})

server.listen(port, ()=>console.log("listening on",port));