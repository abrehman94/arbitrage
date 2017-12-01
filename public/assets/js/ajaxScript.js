$(document).ready(function(){
    //var servername = "https://quiet-hamlet-43198.herokuapp.com";
	var servername = "http://localhost:4000"
    var coin = "btc";
    var count = 0;
    var fname ="";
    var cs = kx = bb = bf = kr = cx = false;  
    var timeInterval=10000;
    var curr = "usd";
    var rate=62.5;
    var fees = 0.00;

    $("#ok").click(()=>{
        if(document.getElementById("feesInput").value >9.99){
            alert("fees cannot be set more than 9.99%");
            document.getElementById("feesInput").value=0.00;
        }
        else if(document.getElementById("updateInput").value<5 && document.getElementById("updateInput").value>30){
            alert("update time must be between 5 and 30 seconds");
        }
        else{
            timeInterval = document.getElementById("updateInput").value;
            timeInterval = parseInt(timeInterval)*1000;
            fees = document.getElementById("feesInput").value;
            addLoading();
            setTimeout(removeLoading, timeInterval);
            ajaxController(true);
            ajaxController(false);
        }
    });

    $.ajax({
        type:"GET",
        url: "https://cors-anywhere.herokuapp.com/http://www.apilayer.net/api/live?access_key=496c69ded145c03cb772f8ea7ce48546",
        dataType: "json",
        success : (data)=>{
            rate = parseFloat(parseInt(data.quotes.USDINR*10)/10);
        },
        error : ()=>{
            console.log("error regarding currency conversion");
        }
    })


    $(".data .data-holder span:nth-of-type(1)").text("loading");
    $(".data").removeClass("null");
    runAjax(coin);
    ajaxController(false);
    addLoading();
    setTimeout(removeLoading,5000);

    $(".btc").click(()=>{
        if(coin!=="btc"){
            //stop=true;
            coin = "btc";
            buttonPressed(coin, "btn-option");
        }
    });

    $(".bch").click(()=>{
        if(coin!=="bch"){
            //stop=true;
            coin = "bch";
            buttonPressed(coin, "btn-option");
        }
    });
    // $(".btg").click(()=>{
    //     stop=true;
    //     ajaxController(true);
    // });

    $(".eth").click(()=>{
        if(coin!=="eth"){
            //stop=true;
            coin = "eth";
            buttonPressed(coin, "btn-option");
        }
    });

    $(".usd").click(()=>{
        if(curr!=="usd"){
            curr="usd";
            buttonPressed(curr, "btn-currency");
        }
    });

    $(".inr").click(()=>{
        if(curr!=="inr"){
            curr="inr";
            buttonPressed(curr, "btn-currency");
        }
    });

    function buttonPressed(btn, theClass){
        $("."+theClass).removeClass("highlight");
        $("."+btn).addClass("highlight");
        addLoading();
        setTimeout(removeLoading,timeInterval);
        cs = kx = bb = bf = kr = cx = false; 
        count=0;
    }

    function removeLoading(){
        $(".loading").fadeOut(500);
    }
    function addLoading(){
        $(".loading").fadeIn(500);
    }

    function ajaxController(kill){
        
        if(kill){
            clearInterval(fname);
            
        }
        else if(!kill){
            fname = setInterval(runAjax,timeInterval,coin);
        }

    }


    function runAjax() { 
        cs = kx = bb = bf = kr = cx = false;    
        var skipcs = skipkx = skipbb = skipbf = skipkr = skipcx = false;
        var coinsecureURL ="";
        if(coin=="btc"){
            coinsecureURL = servername+"/getDataCoinsecure/btc"+"/"+curr; 
        }
        else{
            //coinsecureURL = servername+"/getDataCoinsecure/none";
            coinsecureURL = servername+"/returnNull.json";
        }

        $.ajax({
        type: "GET",
        url: coinsecureURL,
        datatype: "json"
    })
    .done(function(data){
        if(data.sell==0 || data.buy==0){
                $(".coinsecure").parent().addClass("null");
                $(".coinsecure span").text("");
            }
            else{
                $(".coinsecure").parent().removeClass("null");
                if(count==0)$(".coinsecure span").text("-");
                var coinsecure = {
                    sell: data.sell,
                    buy: data.buy
                }
                if(fees!=0.00){
                    console.log("value before:", coinsecure.sell);
                    coinsecure=addFees(coinsecure);
                    console.log("value after:", coinsecure.sell);
                }
                $(".coinsecure span:nth-of-type(3)").text("sell:"+data.sell);
                $(".coinsecure span:nth-of-type(4)").text("buy:"+data.buy);
                cs = true;
            }

        var koinexURL = "";
        if(coin=="btc" || coin =="eth" || coin=="bch"){
            koinexURL = "https://koinex.in/api/ticker"; //servername+"/getDataKoinex/btc";
        }
        else{
            koinexURL = servername+"/returnNull.json";
        }
        $.get(koinexURL)
        .done(function(data){
            if(data.sell==0 || data.buy==0){
                $(".koinex").parent().addClass("null");
                $(".koinex span").text("");
            }
            else{
                var koinex ={
                    sell:0,
                    buy:0
                };
                $(".koinex").parent().removeClass("null");
                if(count==0)$(".koinex span").text("-");
                if(coin=="btc" || coin =="eth" || coin == "bch"){
                    koinex = {
                        sell: Math.round(parseFloat((data.stats[String(coin).toUpperCase()].lowest_ask)/10))/10,
                        buy: Math.round(parseFloat((data.stats[String(coin).toUpperCase()].highest_bid)/10))/10
                    }
                }
                if(curr=="inr"){
                    console.log(koinex.sell);
                    koinex.sell = Math.round(parseFloat(koinex.sell*rate*10))/10;
                    console.log(koinex.sell);
                    koinex.buy = Math.round(parseFloat(koinex.buy*rate*10))/10;
                }

                if(fees!==0.00){
                    koinex =addFees(koinex);
                }
                $(".koinex span:nth-of-type(3)").text("sell:"+koinex.sell);
                $(".koinex span:nth-of-type(4)").text("buy:"+koinex.buy);
                kx = true;
                if(coin=="eth"){
                    cs = false;
                    if(count<3){
                        $(".koinex-coinsecure span:nth-of-type(2)").text("-");
                        $(".koinex-coinsecure span:nth-of-type(1)").text("-");
                    }
                }
                if(cs){
                    $(".koinex-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-koinex.sell)*10)/10);
                    $(".koinex-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
                    $(".coinsecure-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-coinsecure.sell)*10)/10);
                    $(".coinsecure-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
                }
                var list = $(".coinsecure, .koinex");
                colorify(list);
            }
            var bitbayURL = "";
            if(coin=="btc"){
                bitbayURL= servername+"/getDataBitbay/btc"+"/"+curr; 
            }
            else if(coin=="eth"){
                bitbayURL = servername+"/getDataBitbay/eth"+"/"+curr; 
            }
            else {
                bitbayURL = servername+"/returnNull.json"; 
            }
            $.ajax({
                type: "GET",
                url: bitbayURL,
                datatype: "json"
            })
            .done(function(data){
                if(data.sell==0 || data.buy==0){
                    $(".bitbay").parent().addClass("null");
                    $(".bitbay span").text("");
                }
                else{        
                    $(".bitbay").parent().removeClass("null");
                    if(count==0)$(".bitbay span").text("-");
                    var bitbay = {
                        sell: data.sell,
                        buy: data.buy
                    }
                    if(fees!==0.00){
                        bitbay=addFees(bitbay);
                    }
                    $(".bitbay span:nth-of-type(3)").text("sell:"+data.sell);
                    $(".bitbay span:nth-of-type(4)").text("buy:"+data.buy);
                    bb = true;

                    if(coin=="eth"){
                        cs = false;
                        if(count<3){
                            $(".bitbay-coinsecure span:nth-of-type(2)").text("-");
                            $(".bitbay-coinsecure span:nth-of-type(1)").text("-");
                        }
                    }

                    if(cs){
                        $(".bitbay-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-bitbay.sell)*10)/10);
                        $(".bitbay-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-bitbay.sell)/bitbay.sell)*1000)/10)+"%");
    
                        $(".coinsecure-bitbay span:nth-of-type(2)").text(Math.round((bitbay.buy-coinsecure.sell)*10)/10);
                        $(".coinsecure-bitbay span:nth-of-type(1)").text((Math.round(((bitbay.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
                    }
                    if(kx){
                        $(".bitbay-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-bitbay.sell)*10)/10);
                        $(".bitbay-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-bitbay.sell)/bitbay.sell)*1000)/10)+"%");

                        $(".koinex-bitbay span:nth-of-type(2)").text(Math.round((bitbay.buy-koinex.sell)*10)/10);
                        $(".koinex-bitbay span:nth-of-type(1)").text((Math.round(((bitbay.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
                    }
                    var list = $(".coinsecure, .koinex, .bitbay");
                    colorify(list);

                }
                bitfinexURL=servername+"/getDataBitfinex/"+coin+"/"+curr;
                $.ajax({
                    type: "GET",
                    url: bitfinexURL,
                    datatype: "json"
                })
                .done(function(data){
                    if(data.sell==0 || data.buy==0){
                        $(".bitfinex").parent().addClass("null");
                        $(".bitfinex span").text("");
                    }
                    else{
                        $(".bitfinex").parent().removeClass("null");
                        if(count==0)$(".bitfinex span").text("-");
                        var bitfinex = {
                            sell: data.sell,
                            buy: data.buy
                        }
                        if(fees!==0.00){
                            bitfinex =addFees(bitfinex);
                        }
                        $(".bitfinex span:nth-of-type(3)").text("sell:"+data.sell);
                        $(".bitfinex span:nth-of-type(4)").text("buy:"+data.buy);
                        bf = true;
                        if(coin=="eth"){
                            cs = false;
                            if(count<3){
                                $(".bitfinex-coinsecure span:nth-of-type(2)").text("-");
                                $(".bitfinex-coinsecure span:nth-of-type(1)").text("-");
                            }
                        }
                        else if(coin == "bch"){
                            cs = kx = bb = false;
                            if(count<3){
                                $(".bitfinex-coinsecure span:nth-of-type(2)").text("-");
                                $(".bitfinex-coinsecure span:nth-of-type(1)").text("-");
                                $(".bitfinex-koinex span:nth-of-type(2)").text("-");
                                $(".bitfinex-koinex span:nth-of-type(1)").text("-");
                                $(".bitfinex-bitbay span:nth-of-type(2)").text("-");
                                $(".bitfinex-bitbay span:nth-of-type(1)").text("-");
                            }
                        }
                        if(cs){
                            $(".bitfinex-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-bitfinex.sell)*10)/10);
                            $(".bitfinex-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-bitfinex.sell)/bitfinex.sell)*1000)/10)+"%");
                            $(".coinsecure-bitfinex span:nth-of-type(2)").text(Math.round((bitfinex.buy-coinsecure.sell)*10)/10);
                            $(".coinsecure-bitfinex span:nth-of-type(1)").text((Math.round(((bitfinex.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
                        }
                        if(kx){
                            $(".bitfinex-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-bitfinex.sell)*10)/10);
                            $(".bitfinex-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-bitfinex.sell)/bitfinex.sell)*1000)/10)+"%");
                            $(".koinex-bitfinex span:nth-of-type(2)").text(Math.round((bitfinex.buy-koinex.sell)*10)/10);
                            $(".koinex-bitfinex span:nth-of-type(1)").text((Math.round(((bitfinex.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
                        }
                        if(bb){
                            $(".bitfinex-bitbay span:nth-of-type(2)").text(Math.round((bitbay.buy-bitfinex.sell)*10)/10);
                            $(".bitfinex-bitbay span:nth-of-type(1)").text((Math.round(((bitbay.buy-bitfinex.sell)/bitfinex.sell)*1000)/10)+"%");
                            $(".bitbay-bitfinex span:nth-of-type(2)").text(Math.round((bitfinex.buy-bitbay.sell)*10)/10);
                            $(".bitbay-bitfinex span:nth-of-type(1)").text((Math.round(((bitfinex.buy-bitbay.sell)/bitbay.sell)*1000)/10)+"%");
                        }

                        var list = $(".bitfinex, .koinex, .coinsecure, .bitbay");
                        colorify(list);

                    }
                    var krakenURL = "";
                    if(coin=="btc"){
                        krakenURL = servername+"/getDataKraken/btc"+"/"+curr; 
                    }
                    else{
                        krakenURL = servername+"/returnNull.json";
                    }
                    $.ajax({
                        type: "GET",
                        url: krakenURL,
                        datatype: "json"
                    })
                    .done(function(data){
                        if(data.sell==0 || data.buy==0){
                            $(".kraken").parent().addClass("null");
                            $(".kraken span").text("");
                        }
                        else{
                            $(".kraken").parent().removeClass("null");
                            if(count==0)$(".kraken span").text("-");
                            var kraken = {
                                sell: data.sell,
                                buy: data.buy
                            }
                            if(fees!==0.00){
                                kraken=addFees(kraken);
                            }
                            $(".kraken span:nth-of-type(3)").text("sell:"+data.sell);
                            $(".kraken span:nth-of-type(4)").text("buy:"+data.buy);
                            kr = true;

                            if(cs){
                                $(".kraken-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-kraken.sell)*10)/10);
                                $(".kraken-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-kraken.sell)/kraken.sell)*1000)/10)+"%");
                                $(".coinsecure-kraken span:nth-of-type(2)").text(Math.round((kraken.buy-coinsecure.sell)*10)/10);
                                $(".coinsecure-kraken span:nth-of-type(1)").text((Math.round(((kraken.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
                            }
                            if(kx){
                                $(".kraken-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-kraken.sell)*10)/10);
                                $(".kraken-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-kraken.sell)/kraken.sell)*1000)/10)+"%");
                                $(".koinex-kraken span:nth-of-type(2)").text(Math.round((kraken.buy-koinex.sell)*10)/10);
                                $(".koinex-kraken span:nth-of-type(1)").text((Math.round(((kraken.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
                            }
                            if(bb){
                                $(".kraken-bitbay span:nth-of-type(2)").text(Math.round((bitbay.buy-kraken.sell)*10)/10);
                                $(".kraken-bitbay span:nth-of-type(1)").text((Math.round(((bitbay.buy-kraken.sell)/kraken.sell)*1000)/10)+"%");
                                $(".bitbay-kraken span:nth-of-type(2)").text(Math.round((kraken.buy-bitbay.sell)*10)/10);
                                $(".bitbay-kraken span:nth-of-type(1)").text((Math.round(((kraken.buy-bitbay.sell)/bitbay.sell)*1000)/10)+"%");
                            }
                            if(bf){
                                $(".kraken-bitfinex span:nth-of-type(2)").text(Math.round((bitfinex.buy-kraken.sell)*10)/10);
                                $(".kraken-bitfinex span:nth-of-type(1)").text((Math.round(((bitfinex.buy-kraken.sell)/kraken.sell)*1000)/10)+"%");
                                $(".bitfinex-kraken span:nth-of-type(2)").text(Math.round((kraken.buy-bitfinex.sell)*10)/10);
                                $(".bitfinex-kraken span:nth-of-type(1)").text((Math.round(((kraken.buy-bitfinex.sell)/bitfinex.sell)*1000)/10)+"%");
                            }
                            var list = $(".kraken, .bitfinex, .koinex, .coinsecure, .bitbay");
                            colorify(list);
                            // var list = $(".kraken");
                            // for(var i=0; i<list.length; i++){
                            //     //console.log($(list[i]).children("span:nth-of-type(2)"));
                            //     try{
                                    
                            //         if(parseInt($(list[i]).children("span:nth-of-type(2)").text()) <0){
                            //             $(list[i]).children("span:nth-of-type(1)").addClass("red");
                            //             $(list[i]).children("span:nth-of-type(2)").addClass("red");
                            //         }
                            //         else if (parseInt($(list[i]).children("span:nth-of-type(2)").text()) >0){
                            //             $(list[i]).children("span:nth-of-type(1)").addClass("green");
                            //             $(list[i]).children("span:nth-of-type(2)").addClass("green");
                            //         }
                                    
                            //     }
                            //     catch(err){
    
                            //     }
                            // }
                        }
                        var cexURL = "";

                        if(coin=="btc"){
                            cexURL = servername+"/getDataCex/btc"+"/"+curr;
                        }
                        else if(coin=="bch"){
                            cexURL = servername+"/getDataCex/bch"+"/"+curr;
                        }
                        else if(coin=="eth"){
                            cexURL = servername+"/getDataCex/eth"+"/"+curr;
                        }
                        else{
                            cexURL = servername+"/returnNull.json";
                        }
                        $.ajax({
                            type: "GET",
                            url: cexURL,
                            datatype: "json"
                        })
                        .done(function(data){
                            if(data.sell==0 || data.buy==0){
                                $(".cex").parent().addClass("null");
                                $(".cex span").text("");
                            }
                            else{
                                $(".cex").parent().removeClass("null");
                                if(count==0)$(".cex span").text("-");
                                var cex = {
                                    sell: data.sell,
                                    buy: data.buy
                                }
                                if(fees!==0.00){
                                    cex=addFees(cex);
                                }
                                $(".cex span:nth-of-type(3)").text("sell:"+data.sell);
                                $(".cex span:nth-of-type(4)").text("buy:"+data.buy);
                                cx = true;
                                if(coin=="eth"){
                                    cs = kr = false;
                                    if(count<3){
                                        $(".cex-coinsecure span:nth-of-type(2)").text("-");
                                        $(".cex-coinsecure span:nth-of-type(1)").text("-");
                                        $(".cex-kraken span:nth-of-type(2)").text("-");
                                        $(".cex-kraken span:nth-of-type(1)").text("-");
                                    }
                                }
                                else if(coin == "bch"){
                                    cs = kx = bb =kr = false;
                                    if(count<3){
                                        $(".cex-coinsecure span:nth-of-type(2)").text("-");
                                        $(".cex-coinsecure span:nth-of-type(1)").text("-");
                                        $(".cex-koinex span:nth-of-type(2)").text("-");
                                        $(".cex-koinex span:nth-of-type(1)").text("-");
                                        $(".cex-bitbay span:nth-of-type(2)").text("-");
                                        $(".cex-bitbay span:nth-of-type(1)").text("-");
                                        $(".cex-kraken span:nth-of-type(2)").text("-");
                                        $(".cex-kraken span:nth-of-type(1)").text("-");
                                    }
                                }
                                if(cs){
                                    $(".cex-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-cex.sell)*10)/10);
                                    $(".cex-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-cex.sell)/cex.sell)*1000)/10)+"%");
        
                                    $(".coinsecure-cex span:nth-of-type(2)").text(Math.round((cex.buy-coinsecure.sell)*10)/10);
                                    $(".coinsecure-cex span:nth-of-type(1)").text((Math.round(((cex.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
                                }
                                if(kx){
                                    $(".cex-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-cex.sell)*10)/10);
                                    $(".cex-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-cex.sell)/cex.sell)*1000)/10)+"%");
                                    $(".koinex-cex span:nth-of-type(2)").text(Math.round((cex.buy-koinex.sell)*10)/10);
                                    $(".koinex-cex span:nth-of-type(1)").text((Math.round(((cex.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
                                }
                                if(bb){
                                    $(".cex-bitbay span:nth-of-type(2)").text(Math.round((bitbay.buy-cex.sell)*10)/10);
                                    $(".cex-bitbay span:nth-of-type(1)").text((Math.round(((bitbay.buy-cex.sell)/cex.sell)*1000)/10)+"%");
                                    $(".bitbay-cex span:nth-of-type(2)").text(Math.round((cex.buy-bitbay.sell)*10)/10);
                                    $(".bitbay-cex span:nth-of-type(1)").text((Math.round(((cex.buy-bitbay.sell)/bitbay.sell)*1000)/10)+"%");
                                }
                                if(bf){
                                    $(".cex-bitfinex span:nth-of-type(2)").text(Math.round((bitfinex.buy-cex.sell)*10)/10);
                                    $(".cex-bitfinex span:nth-of-type(1)").text((Math.round(((bitfinex.buy-cex.sell)/cex.sell)*1000)/10)+"%");
                                    $(".bitfinex-cex span:nth-of-type(2)").text(Math.round((cex.buy-bitfinex.sell)*10)/10);
                                    $(".bitfinex-cex span:nth-of-type(1)").text((Math.round(((cex.buy-bitfinex.sell)/bitfinex.sell)*1000)/10)+"%");
                                }
                                if(kr){
                                    $(".cex-kraken span:nth-of-type(2)").text(Math.round((kraken.buy-cex.sell)*10)/10);
                                    $(".cex-kraken span:nth-of-type(1)").text((Math.round(((bitfinex.buy-cex.sell)/cex.sell)*1000)/10)+"%");
                                    $(".kraken-cex span:nth-of-type(2)").text(Math.round((cex.buy-kraken.sell)*10)/10);
                                    $(".kraken-cex span:nth-of-type(1)").text((Math.round(((cex.buy-kraken.sell)/kraken.sell)*1000)/10)+"%");
                                }
                                var list = $(".cex, .kraken, .bitfinex, .koinex, .coinsecure, .bitbay");
                                colorify(list);
                                count++;
                            }
                            
                            
                        })
                        .fail(function(err){
                            // alert("error");
                            // console.log("hello");
                            console.log(err);
                        })
                    })
                    .fail(function(err){
                        // alert("error");
                        // console.log("hello");
                        console.log(err);
                    })
                    
                })
                .fail(function(err){
                    // alert("error");
                    // console.log("hello");
                    console.log(err);
                })

            })
            .fail(function(err){
                // alert("error");
                // console.log("hello");
                console.log(err);
            })

        })
        .fail(function(err){
            // alert("error");
            // console.log("hello");
            console.log(err);
        })

    })
    .fail(function(err){
        // alert("error");
        // console.log("hello");
        console.log(err);
    })
}

function addFees(obj){
    objNew= {
        sell : Math.round((obj.sell + (obj.sell*(fees/100))*10))/10,
        buy : Math.round((obj.buy + (obj.buy*(fees/100))*10))/10
    }
    return objNew;
    
}
});

async function colorify(list){
    for(var i=0; i<list.length; i++){
        //console.log($(list[i]).children("span:nth-of-type(2)"));
        try{
            if(parseInt($(list[i]).children("span:nth-of-type(2)").text()) <0){
                $(list[i]).children("span:nth-of-type(1)").addClass("red");
                $(list[i]).children("span:nth-of-type(2)").addClass("red");
            }
            else if (parseInt($(list[i]).children("span:nth-of-type(2)").text()) >0){
                $(list[i]).children("span:nth-of-type(1)").addClass("green");
                $(list[i]).children("span:nth-of-type(2)").addClass("green");
            }
            
        }
        catch(err){

        }
    }
    
}


