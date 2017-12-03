const express = require("express");
const http = require("http");
const path = require("path");
const publicPath = path.join(__dirname+"/public");
const port = process.env.PORT || 4000;
var request = require("request");
var app = express();
var trade = require("./trades/trade.js");
var tradeValues = trade.tradeValues;
var server = http.createServer(app);

var sendNull = {
    buy:0,
    sell:0
}

var url1 = "https://api.coinsecure.in/v1/exchange/ticker";
var url2 = "https://koinex.in/api/ticker";
var url3_1 = "https://bitbay.net/API/Public/";
var url3_2 = "USD/ticker.json";
//var url3 = "https://cors-anywhere.herokuapp.com/https://bitbay.net/API/Public/btc/market.json";
var url4 = "https://api.bitfinex.com/v1/pubticker/";//btcusd";
var url5 = "https://api.kraken.com/0/public/Ticker?pair="//XBTUSD";
var url6 = "https://cex.io/api/ticker/";//BTC/USD";


app.use(express.static(publicPath));

app.get("/getRate",(req,res)=>{
    res.send({rate:trade.rate});
});

app.get("/getDataCoinsecure/:coin/:curr", function(req,res){
    if(req.params.coin=="btc"){
        tradeValues(url1,"coinsecure",req.params.curr)
        .then((data)=>{
            res.send({
                buy: data.bid,
                sell: data.ask
            });
        },
        (err)=>{
        console.log(err);
        })
    }
    else{
        res.send(sendNull);
    }
});

app.get("/getDataKoinex/:coin/:curr", function(req,res){
    if(req.params.coin =="none"){
        res.send(sendNull);
    }
    else{
        tradeValues(url2,"koinex",req.params.curr,req.params.coin)
        .then((data)=>{
            res.send({
                buy: data.bid,
                sell: data.ask
            });
        }, (err)=>{
            console.log(err);
        })
    }
})

app.get("/getDataBitbay/:coin/:curr", function(req,res){
    if(req.params.coin =="none"){
        res.send(sendNull);
    }

    else{
        var url3 = url3_1 + req.params.coin +url3_2;
        tradeValues(url3,"bitbay",req.params.curr)
        .then((data)=>{
            res.send({
                buy: data.bid,
                sell: data.ask
            });
        }, (err)=>{
            console.log(err);
        })
    }

})


app.get("/getDataBitfinex/:coin/:curr", function(req,res){

    if(req.params.coin =="none"){
        res.send(sendNull());
    }

    else{
        var url4New = url4 + req.params.coin +"usd";;
        tradeValues(url4New,"bitfinex",req.params.curr)
        .then((data)=>{
            res.send({
                buy: data.bid,
                sell: data.ask
            });
        }, (err)=>{
            console.log(err);
        })
    }

})


app.get("/getDataKraken/:coin/:curr", function(req,res){
    if(req.params.coin=="none"){
        res.send(sendNull);
    }
    else{
        var coinName = (req.params.curr === "btc" ? "XBT" : String(req.params.curr).toUpperCase() );
        var url5New = ulr5+coinName+"USD";
        tradeValues(url5,"kraken",req.params.curr)
        .then((data)=>{
            res.send({
                buy: data.bid,
                sell: data.ask
            });
        }, (err)=>{
            console.log(err);
        })
    }

})


app.get("/getDataCex/:coin/:curr", function(req,res){
    if(req.params.coin=="none"){
        res.send(sendNull);
    }
    else{
        var coinName = String(req.params.coin).toUpperCase();
        var url6New =url6 + coinName  +"/USD";
        tradeValues(url6New,"cex.io",req.params.curr)
        .then((data)=>{
            res.send({
                buy: data.bid,
                sell: data.ask
            });
        }, (err)=>{
            console.log(err);
        })
    }

})


server.listen(port, ()=>console.log("listening on",port));
