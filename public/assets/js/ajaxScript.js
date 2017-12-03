$(document).ready(function(){
    var servername = "https://quiet-hamlet-43198.herokuapp.com";
	//var servername = "http://localhost:4000"
    var coin = "btc";
    var count = 0;
    var fname ="";
    var cs = kx = bb = bf = kr = cx = false;  
    var timeInterval=5000;
    var curr = "usd";
    var rate=64.5;
    var fees = false;
    var feescs = 0.00;
    var feeskx = 0.00;
    var feesbb = 0.00;
    var feesbf = 0.00;
    var feeskr = 0.00;
    var feescx = 0.00;
    var stop=false;
    var boolKilled = false;
    var coinsecure = undefined;
    var koinex = undefined;
    var bitbay = undefined;
    var bitfinex = undefined;
    var kraken = undefined;
    var cex = undefined;
	var mycors = "https://guarded-cliffs-21055.herokuapp.com/";

    function killed(){};

    $(".data .data-holder span:nth-of-type(1)").text("loading");
    $(".data").removeClass("null");
    runAjax(coin);
    ajaxController(false);
    //addLoading();
    setTimeout(removeLoading,5000);

    $("#ok").click(()=>{
//        var allFees = $(".fees input");
//        for(var i =0; i<allFees.length; i++){
//            if($(allFees[i]))
//        }
//        if(document.getElementById("feesInput").value >9.99){
//            alert("fees cannot be set more than 9.99%");
//            document.getElementById("feesInput").value=0.00;
//        }
        if(document.getElementById("updateInput").value<5 && document.getElementById("updateInput").value>30){
            alert("update time must be between 5 and 30 seconds");
        }
        else{
            timeInterval = document.getElementById("updateInput").value;
            timeInterval = parseInt(timeInterval)*1000;
            feescs = parseFloat(document.getElementById("feescs").value) || 0.00;
            feeskx = parseFloat(document.getElementById("feeskx").value) || 0.00;
            feesbb = parseFloat(document.getElementById("feesbb").value) || 0.00;
            feesbf = parseFloat(document.getElementById("feesbf").value) || 0.00;
            feeskr = parseFloat(document.getElementById("feeskr").value) || 0.00;
            feescx = parseFloat(document.getElementById("feescx").value) || 0.00;
            //fees=true;
            //buttonPressed("feestrue", "fees-option");
             buttonPressed("nothing-Class", "nothing-Class");
            
        }
    });
    var mouseOnSettings = false;
    $(".gear").on({
        mouseenter: function(){
            $(".gear").addClass("rot");
            $(".content").slideDown(()=>$(".gear").removeClass("rot"));
            mouseOnSettings = true;
        },
        mouseleave: function(){
            mouseOnSettings = false;
            setTimeout(settingsleave, 500);
        }
    });
    $(".content").on({
    mouseenter: function(){
        mouseOnSettings = true;
    },
    mouseleave: function(){
        mouseOnSettings = false;
        setTimeout(settingsleave, 100);
    }});
    function settingsleave(){
            if(!mouseOnSettings){
                $(".gear").addClass("rotBack");
                $(".content").slideUp(()=>{
                    $(".gear").removeClass("rotBack");
                });
                
            }
            //setTimeout(settingsleave, 1000);
    }
        
    $.ajax({
        type:"GET",
        url: servername+"/getRate",
        dataType: "json",
        success : (data)=>{
            updateRate(data.rate);
        },
        error : ()=>{
            console.log("error regarding currency conversion");
        }
    })
	
	function updateRate(value){
		rate=value;
    }
    $(".feestrue").click(()=>{
        if(!fees){
            fees=true;
            buttonPressed("feestrue", "fees-option");
        }
    });
    $(".nofees").click(()=>{
        if(fees){
            fees=false;
            buttonPressed("nofees", "fees-option");
        }
    });

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
        stop=true;
        ajaxController(true);
        reNew();
        $("."+theClass).removeClass("highlight");
        $("."+btn).addClass("highlight");
        addLoading();
        setTimeout(removeLoading,500);
        count=0;
        reRun();
    }

    function reRun(){
        if(boolKilled){
            stop = false;
            boolKilled = false;
            runAjax(coin);
            ajaxController(false);
        }
        else{
            setTimeout(reRun,5);
        }
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
        boolKilled = false;
        try{
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
        if(stop)throw killed();
        $.ajax({
        type: "GET",
        url: coinsecureURL,
        datatype: "json"
        })
        .done(function(data){
            if(stop)throw killed();
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
                    if(feescs!=0.00 && fees){
                        coinsecure=addFees(coinsecure,feescs);
                    }
                    $(".coinsecure span:nth-of-type(3)").text("sell:"+data.sell);
                    $(".coinsecure span:nth-of-type(4)").text("buy:"+data.buy);
                    cs = true;
                    setValues(coinsecure,"cs");
                }
        })
        .fail(()=>console.log("error with coinsecure"))
		if(count%8==0){
        var koinexURL = "";
        if(coin=="btc" || coin =="eth" || coin=="bch"){
            koinexURL = mycors+"https://koinex.in/api/ticker"; //servername+"/getDataKoinex/btc";
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
                        sell: Math.round(parseFloat((data.stats[String(coin).toUpperCase()].lowest_ask)*10))/10,
                        buy: Math.round(parseFloat((data.stats[String(coin).toUpperCase()].highest_bid)*10))/10
                    }
                }
                if(curr=="usd"){
                    koinex.sell = Math.round((parseFloat(koinex.sell/rate)*10))/10;
                    koinex.buy = Math.round((parseFloat(koinex.buy/rate)*10))/10;
                }

                if(feeskx!==0.00 && fees){
                    koinex =addFees(koinex,feeskx);
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
                setValues(koinex,"kx");
                update(coinsecure,koinex,bitbay,bitfinex,kraken,cex);
                var list = $(".coinsecure, .koinex");
                colorify(list);
            }
        })
        .fail((err)=>console.log("error with koinex",err))
		}
        if(stop)throw killed();
        var bitbayURL = "";
        if(coin=="btc"){
            bitbayURL= servername+"/getDataBitbay/btc"+"/"+curr; 
        }
        else if(coin=="eth"){
            bitbayURL = servername+"/getDataBitbay/eth"+"/"+curr; 
        }
            else if(coin=="bch"){
            bitbayURL = servername+"/getDataBitbay/eth"+"/"+"bcc"; 
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
            if(stop)throw killed();
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
                if(feesbb!==0.00 && fees){
                    bitbay=addFees(bitbay,feesbb);
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
                setValues(bitbay,"bb");
                update(coinsecure,koinex,bitbay,bitfinex,kraken,cex);
                var list = $(".coinsecure, .koinex, .bitbay");
                colorify(list);

            }
        })
        .fail(()=>console.log("error with bitbay"))
        if(stop)throw killed();
            var bitfinexURL="";
            bitfinexURL=servername+"/getDataBitfinex/"+coin+"/"+curr;
            $.ajax({
                type: "GET",
                url: bitfinexURL,
                datatype: "json"
            })
            .done(function(data){
                if(stop)throw killed();
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
                    if(feesbf!==0.00 && fees){
                        bitfinex =addFees(bitfinex,feesbf);
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
                    setValues(bitfinex,"bf");
                    update(coinsecure,koinex,bitbay,bitfinex,kraken,cex);
                    var list = $(".bitfinex, .koinex, .coinsecure, .bitbay");
                    colorify(list);
                    if(stop)throw killed();

                }
            })
            .fail(()=>console.log("error with bitfinex"))

            if(stop)throw killed();
            
            var krakenURL = "";
            if(coin=="btc" || coin=="bch" || coin =="eth"){
                krakenURL = servername+"/getDataKraken/"+coin+"/"+curr; 
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
                if(stop)throw killed();
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
                    if(feeskr!==0.00 && fees){
                        kraken=addFees(kraken,feeskr);
                    }
                    $(".kraken span:nth-of-type(3)").text("sell:"+data.sell);
                    $(".kraken span:nth-of-type(4)").text("buy:"+data.buy);
                    kr = true;
                    setValues(kraken,"kr");
                    update();
                    colorify();
                }
            })
            .fail(()=>console.log("error with kraken"))
                    
                    if(stop)throw killed();
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
                        if(stop)throw killed();
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
                            if(feescx!==0.00 && fees){
                                cex=addFees(cex,feescx);
                            }
                            $(".cex span:nth-of-type(3)").text("sell:"+data.sell);
                            $(".cex span:nth-of-type(4)").text("buy:"+data.buy);
                            cx = true;
                            if(coin=="eth"){
                                cs  = false;
                                if(count<3){
                                    $(".cex-coinsecure span:nth-of-type(2)").text("-");
                                    $(".cex-coinsecure span:nth-of-type(1)").text("-");
                                }
                            }
                            else if(coin == "bch"){
                                cs = kx = bb = false;
                                if(count<3){
                                    $(".cex-coinsecure span:nth-of-type(2)").text("-");
                                    $(".cex-coinsecure span:nth-of-type(1)").text("-");
                                    $(".cex-koinex span:nth-of-type(2)").text("-");
                                    $(".cex-koinex span:nth-of-type(1)").text("-");
                                    $(".cex-bitbay span:nth-of-type(2)").text("-");
                                    $(".cex-bitbay span:nth-of-type(1)").text("-");
                                }
                            }
                            setValues(cex,"cx");
                            update();
                            var list = $(".cex, .kraken, .bitfinex, .koinex, .coinsecure, .bitbay");
                            colorify(list);
                        }
                        
                        
                    })
                    .fail(()=>console.log("error with cex"))
                    boolKilled=true;
					count++;
                }
            catch(err){
                boolKilled = true;
                return;
            }
        }

function addFees(obj,fees){
    objNew= {
        sell : Math.round((obj.sell - (obj.sell*(fees/100)))*10)/10,
        buy : Math.round((obj.buy + (obj.buy*(fees/100)))*10)/10
    }
    return objNew;
    
}

function reNew(){
    coinsecure = undefined;
    koinex = undefined;
    bitbay = undefined;
    bitfinex = undefined;
    kraken = undefined;
    cex = undefined;
    $(".data .data-holder span").text("-");
}

function setValues(obj, string){
    try{
        switch (string) {
            case "cs":
                coinsecure = {
                    buy : obj.buy,
                    sell : obj.sell
                };
                break;
            case "kx":
                koinex = {
                    buy : obj.buy,
                    sell : obj.sell
                };
                break;
            case "bb":
                bitbay  = {
                    buy : obj.buy,
                    sell : obj.sell
                };
                break;
            case "bf":
                bitfinex = {
                    buy : obj.buy,
                    sell : obj.sell
                };
                break;
            case "kr":
                kraken = {
                    buy : obj.buy,
                    sell : obj.sell
                };
                break;
            case "cx":
                cex = {
                    buy : obj.buy,
                    sell : obj.sell
                };
                break;
        }
    }
    catch(e){
        console.log("some error", e);
    }
};


function update(){
    coinsecure = isNaN(parseInt($(".coinsecure span:nth-of-type(3)").text().slice(5))) ? undefined : coinsecure;
    koinex = isNaN(parseInt($(".koinex span:nth-of-type(3)").text().slice(5))) ? undefined : koinex;
    bitbay = isNaN(parseInt($(".bitbay span:nth-of-type(3)").text().slice(5))) ? undefined : bitbay;
    bitfinex = isNaN(parseInt($(".bitfinex span:nth-of-type(3)").text().slice(5))) ? undefined : bitfinex;
    kraken = isNaN(parseInt($(".kraken span:nth-of-type(3)").text().slice(5))) ? undefined : kraken;
    cex = isNaN(parseInt($(".cex span:nth-of-type(3)").text().slice(5))) ? undefined : cex;

    coinsecure = (coin!="btc" ? undefined : coinsecure);

    try{
        $(".koinex-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-koinex.sell)*10)/10);
        $(".koinex-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
        $(".coinsecure-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-coinsecure.sell)*10)/10);
        $(".coinsecure-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
    }catch(e){
        $(".koinex-coinsecure span:nth-of-type(1)").text("-");
        $(".koinex-coinsecure span:nth-of-type(2)").text("-");
        $(".coinsecure-koinex span:nth-of-type(1)").text("-");
        $(".coinsecure-koinex span:nth-of-type(2)").text("-");
    }


// BITBAY
    try{
        $(".bitbay-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-bitbay.sell)*10)/10);
        $(".bitbay-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-bitbay.sell)/bitbay.sell)*1000)/10)+"%");
        $(".coinsecure-bitbay span:nth-of-type(2)").text(Math.round((bitbay.buy-coinsecure.sell)*10)/10);
        $(".coinsecure-bitbay span:nth-of-type(1)").text((Math.round(((bitbay.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
    }catch(e){
        $(".bitbay-coinsecure span:nth-of-type(1)").text("-");
        $(".bitbay-coinsecure span:nth-of-type(2)").text("-");
        $(".coinsecure-bitbay span:nth-of-type(1)").text("-");
        $(".coinsecure-bitbay span:nth-of-type(2)").text("-");
    }
    try{
        $(".bitbay-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-bitbay.sell)*10)/10);
        $(".bitbay-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-bitbay.sell)/bitbay.sell)*1000)/10)+"%");
        $(".koinex-bitbay span:nth-of-type(2)").text(Math.round((bitbay.buy-koinex.sell)*10)/10);
        $(".koinex-bitbay span:nth-of-type(1)").text((Math.round(((bitbay.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
    }catch(e){
        $(".koinex-bitbay span:nth-of-type(1)").text("-");
        $(".koinex-bitbay span:nth-of-type(2)").text("-");
        $(".bitbay-koinex span:nth-of-type(1)").text("-");
        $(".bitbay-koinex span:nth-of-type(2)").text("-");
    }

// bitfinex

try{
    $(".bitfinex-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-bitfinex.sell)*10)/10);
    $(".bitfinex-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-bitfinex.sell)/bitfinex.sell)*1000)/10)+"%");
    $(".coinsecure-bitfinex span:nth-of-type(2)").text(Math.round((bitfinex.buy-coinsecure.sell)*10)/10);
    $(".coinsecure-bitfinex span:nth-of-type(1)").text((Math.round(((bitfinex.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
}catch(e){
    $(".bitfinex-coinsecure span:nth-of-type(1)").text("-");
    $(".bitfinex-coinsecure span:nth-of-type(2)").text("-");
    $(".coinsecure-bitfinex span:nth-of-type(1)").text("-");
    $(".coinsecure-bitfinex span:nth-of-type(2)").text("-");
}
try{
    $(".bitfinex-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-bitfinex.sell)*10)/10);
    $(".bitfinex-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-bitfinex.sell)/bitfinex.sell)*1000)/10)+"%");
    $(".koinex-bitfinex span:nth-of-type(2)").text(Math.round((bitfinex.buy-koinex.sell)*10)/10);
    $(".koinex-bitfinex span:nth-of-type(1)").text((Math.round(((bitfinex.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
}catch(e){
    $(".koinex-bitfinex span:nth-of-type(1)").text("-");
    $(".koinex-bitfinex span:nth-of-type(2)").text("-");
    $(".bitfinex-koinex span:nth-of-type(1)").text("-");
    $(".bitfinex-koinex span:nth-of-type(2)").text("-");
}
try{
    $(".bitfinex-bitbay span:nth-of-type(2)").text(Math.round((bitbay.buy-bitfinex.sell)*10)/10);
    $(".bitfinex-bitbay span:nth-of-type(1)").text((Math.round(((bitbay.buy-bitfinex.sell)/bitfinex.sell)*1000)/10)+"%");
    $(".bitbay-bitfinex span:nth-of-type(2)").text(Math.round((bitfinex.buy-bitbay.sell)*10)/10);
    $(".bitbay-bitfinex span:nth-of-type(1)").text((Math.round(((bitfinex.buy-bitbay.sell)/bitbay.sell)*1000)/10)+"%");
}catch(e){
    $(".bitbay-bitfinex span:nth-of-type(1)").text("-");
    $(".bitbay-bitfinex span:nth-of-type(2)").text("-");
    $(".bitfinex-bitbay span:nth-of-type(1)").text("-");
    $(".bitfinex-bitbay span:nth-of-type(2)").text("-");
}

// Kraken
    try{
        $(".kraken-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-kraken.sell)*10)/10);
        $(".kraken-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-kraken.sell)/kraken.sell)*1000)/10)+"%");
        $(".coinsecure-kraken span:nth-of-type(2)").text(Math.round((kraken.buy-coinsecure.sell)*10)/10);
        $(".coinsecure-kraken span:nth-of-type(1)").text((Math.round(((kraken.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
    }catch(e){
        $(".coinsecure-kraken span:nth-of-type(1)").text("-");
        $(".coinsecure-kraken span:nth-of-type(2)").text("-");
        $(".kraken-coinsecure span:nth-of-type(1)").text("-");
        $(".kraken-coinsecure span:nth-of-type(2)").text("-");
    }
    try{
        $(".kraken-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-kraken.sell)*10)/10);
        $(".kraken-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-kraken.sell)/kraken.sell)*1000)/10)+"%");
        $(".koinex-kraken span:nth-of-type(2)").text(Math.round((kraken.buy-koinex.sell)*10)/10);
        $(".koinex-kraken span:nth-of-type(1)").text((Math.round(((kraken.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
    }catch(e){
        $(".koinex-kraken span:nth-of-type(1)").text("-");
        $(".koinex-kraken span:nth-of-type(2)").text("-");
        $(".kraken-koinex span:nth-of-type(1)").text("-");
        $(".kraken-koinex span:nth-of-type(2)").text("-");
    }
    try{
        $(".kraken-bitbay span:nth-of-type(2)").text(Math.round((bitbay.buy-kraken.sell)*10)/10);
        $(".kraken-bitbay span:nth-of-type(1)").text((Math.round(((bitbay.buy-kraken.sell)/kraken.sell)*1000)/10)+"%");
        $(".bitbay-kraken span:nth-of-type(2)").text(Math.round((kraken.buy-bitbay.sell)*10)/10);
        $(".bitbay-kraken span:nth-of-type(1)").text((Math.round(((kraken.buy-bitbay.sell)/bitbay.sell)*1000)/10)+"%");
    }catch(e){
        $(".bitbay-kraken span:nth-of-type(1)").text("-");
        $(".bitbay-kraken span:nth-of-type(2)").text("-");
        $(".kraken-bitbay span:nth-of-type(1)").text("-");
        $(".kraken-bitbay span:nth-of-type(2)").text("-");
    }
    try{
        $(".kraken-bitfinex span:nth-of-type(2)").text(Math.round((bitfinex.buy-kraken.sell)*10)/10);
        $(".kraken-bitfinex span:nth-of-type(1)").text((Math.round(((bitfinex.buy-kraken.sell)/kraken.sell)*1000)/10)+"%");
        $(".bitfinex-kraken span:nth-of-type(2)").text(Math.round((kraken.buy-bitfinex.sell)*10)/10);
        $(".bitfinex-kraken span:nth-of-type(1)").text((Math.round(((kraken.buy-bitfinex.sell)/bitfinex.sell)*1000)/10)+"%");
    }catch(e){
        
        $(".bitfinex-kraken span:nth-of-type(1)").text("-");
        $(".bitfinex-kraken span:nth-of-type(2)").text("-");
        $(".kraken-bitfinex span:nth-of-type(1)").text("-");
        $(".kraken-bitfinex span:nth-of-type(2)").text("-");
    }


//Cex

try{
    $(".cex-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-cex.sell)*10)/10);
    $(".cex-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-cex.sell)/cex.sell)*1000)/10)+"%");

    $(".coinsecure-cex span:nth-of-type(2)").text(Math.round((cex.buy-coinsecure.sell)*10)/10);
    $(".coinsecure-cex span:nth-of-type(1)").text((Math.round(((cex.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
}catch(e){
    $(".coinsecure-cex span:nth-of-type(1)").text("-");
    $(".coinsecure-cex span:nth-of-type(2)").text("-");
    $(".cex-coinsecure span:nth-of-type(1)").text("-");
    $(".cex-coinsecure span:nth-of-type(2)").text("-");
}
try{
    $(".cex-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-cex.sell)*10)/10);
    $(".cex-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-cex.sell)/cex.sell)*1000)/10)+"%");
    $(".koinex-cex span:nth-of-type(2)").text(Math.round((cex.buy-koinex.sell)*10)/10);
    $(".koinex-cex span:nth-of-type(1)").text((Math.round(((cex.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
}catch(e){
    $(".koinex-cex span:nth-of-type(1)").text("-");
    $(".koinex-cex span:nth-of-type(2)").text("-");
    $(".cex-koinex span:nth-of-type(1)").text("-");
    $(".cex-koinex span:nth-of-type(2)").text("-");
}
try{
    $(".cex-bitbay span:nth-of-type(2)").text(Math.round((bitbay.buy-cex.sell)*10)/10);
    $(".cex-bitbay span:nth-of-type(1)").text((Math.round(((bitbay.buy-cex.sell)/cex.sell)*1000)/10)+"%");
    $(".bitbay-cex span:nth-of-type(2)").text(Math.round((cex.buy-bitbay.sell)*10)/10);
    $(".bitbay-cex span:nth-of-type(1)").text((Math.round(((cex.buy-bitbay.sell)/bitbay.sell)*1000)/10)+"%");
}catch(e){
    $(".bitbay-cex span:nth-of-type(1)").text("-");
    $(".bitbay-cex span:nth-of-type(2)").text("-");
    $(".cex-bitbay span:nth-of-type(1)").text("-");
    $(".cex-bitbay span:nth-of-type(2)").text("-");
}
try{
    $(".cex-bitfinex span:nth-of-type(2)").text(Math.round((bitfinex.buy-cex.sell)*10)/10);
    $(".cex-bitfinex span:nth-of-type(1)").text((Math.round(((bitfinex.buy-cex.sell)/cex.sell)*1000)/10)+"%");
    $(".bitfinex-cex span:nth-of-type(2)").text(Math.round((cex.buy-bitfinex.sell)*10)/10);
    $(".bitfinex-cex span:nth-of-type(1)").text((Math.round(((cex.buy-bitfinex.sell)/bitfinex.sell)*1000)/10)+"%");
}catch(e){
    $(".bitfinexcex-cex span:nth-of-type(1)").text("-");
    $(".bitfinex-cex span:nth-of-type(2)").text("-");
    $(".cex-bitfinex span:nth-of-type(1)").text("-");
    $(".cex-bitfinex span:nth-of-type(2)").text("-");
}
try{
    $(".cex-kraken span:nth-of-type(2)").text(Math.round((kraken.buy-cex.sell)*10)/10);
    $(".cex-kraken span:nth-of-type(1)").text((Math.round(((bitfinex.buy-cex.sell)/cex.sell)*1000)/10)+"%");
    $(".kraken-cex span:nth-of-type(2)").text(Math.round((cex.buy-kraken.sell)*10)/10);
    $(".kraken-cex span:nth-of-type(1)").text((Math.round(((cex.buy-kraken.sell)/kraken.sell)*1000)/10)+"%");
}catch(e){
    $(".cex-kraken span:nth-of-type(2)").text("-");
    $(".cex-kraken span:nth-of-type(1)").text("-");
    $(".kraken-cex span:nth-of-type(2)").text("-");
    $(".kraken-cex span:nth-of-type(1)").text("-");
}
}
});

async function colorify(){
    list = $(".data .data-holder");
    for(var i=0; i<list.length; i++){
        try{
            if(parseInt($(list[i]).children("span:nth-of-type(2)").text()) <0){
                $(list[i]).children("span:nth-of-type(1)").addClass("red");
                $(list[i]).children("span:nth-of-type(2)").addClass("red");
                $(list[i]).children("span:nth-of-type(1)").removeClass("green");
                $(list[i]).children("span:nth-of-type(2)").removeClass("green");
            }
            else if (parseInt($(list[i]).children("span:nth-of-type(2)").text()) >0){
                $(list[i]).children("span:nth-of-type(1)").addClass("green");
                $(list[i]).children("span:nth-of-type(2)").addClass("green");
                $(list[i]).children("span:nth-of-type(1)").removeClass("red");
                $(list[i]).children("span:nth-of-type(2)").removeClass("red");
            }
            else {
                $(list[i]).children("span:nth-of-type(1)").removeClass("green");
                $(list[i]).children("span:nth-of-type(2)").removeClass("green");
                $(list[i]).children("span:nth-of-type(1)").removeClass("red");
                $(list[i]).children("span:nth-of-type(2)").removeClass("red");
            }
            
        }
        catch(err){

        }
    }
    
}
