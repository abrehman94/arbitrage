$(document).ready(function(){

    $(".data .data-holder span:nth-of-type(1)").text("loading");
    $(".data").removeClass("null");
    function runAjax(count) { 
        console.log("running ajax function");
        var cs = kx = bb = bf = kr = cx = false;    
        $.ajax({
        type: "GET",
        url: "https://quiet-hamlet-43198/getDataCoinsecure",
        datatype: "json"
    })
    .done(function(data){
        if(data.sell==0 || data.buy==0){
                $(".coinsecure").parent().addClass("null");
                $(".coinsecure span").text("");
            }
            else{
                if(count==0)$(".coinsecure span").text("-");
                var coinsecure = {
                    sell: data.sell,
                    buy: data.buy
                }
                $(".coinsecure span:nth-of-type(3)").text("sell:"+data.sell);
                $(".coinsecure span:nth-of-type(4)").text("buy:"+data.buy);
                cs = true;
            }

        $.ajax({
            type: "GET",
            url: "https://quiet-hamlet-43198/getDataKoinex",
            datatype: "json"
        })
        .done(function(data){
            if(data.sell==0 || data.buy==0){
                $(".koinex").parent().addClass("null");
                $(".koinex span").text("");
            }
            else{
                if(count==0)$(".koinex span").text("-");
                var koinex = {
                    sell: data.sell,
                    buy: data.buy
                }
                $(".koinex span:nth-of-type(3)").text("sell:"+data.sell);
                $(".koinex span:nth-of-type(4)").text("buy:"+data.buy);
                kx = true;

                if(cs){
                    $(".koinex-coinsecure span:nth-of-type(2)").text(Math.round((coinsecure.buy-koinex.sell)*10)/10);
                    $(".koinex-coinsecure span:nth-of-type(1)").text((Math.round(((coinsecure.buy-koinex.sell)/koinex.sell)*1000)/10)+"%");
                    $(".coinsecure-koinex span:nth-of-type(2)").text(Math.round((koinex.buy-coinsecure.sell)*10)/10);
                    $(".coinsecure-koinex span:nth-of-type(1)").text((Math.round(((koinex.buy-coinsecure.sell)/coinsecure.sell)*1000)/10)+"%");
                }

            }
            
            $.ajax({
                type: "GET",
                url: "https://quiet-hamlet-43198/getDataBitbay",
                datatype: "json"
            })
            .done(function(data){
                if(data.sell==0 || data.buy==0){
                    $(".bitbay").parent().addClass("null");
                    $(".bitbay span").text("");
                }
                else{        
                    if(count==0)$(".bitbay span").text("-");
                    var bitbay = {
                        sell: data.sell,
                        buy: data.buy
                    }
                    $(".bitbay span:nth-of-type(3)").text("sell:"+data.sell);
                    $(".bitbay span:nth-of-type(4)").text("buy:"+data.buy);
                    bb = true;

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

                }
                
                $.ajax({
                    type: "GET",
                    url: "https://quiet-hamlet-43198/getDataBitfinex",
                    datatype: "json"
                })
                .done(function(data){
                    if(data.sell==0 || data.buy==0){
                        $(".bitfinex").parent().addClass("null");
                        $(".bitfinex span").text("");
                    }
                    else{
                        if(count==0)$(".bitfinex span").text("-");
                        var bitfinex = {
                            sell: data.sell,
                            buy: data.buy
                        }
                        $(".bitfinex span:nth-of-type(3)").text("sell:"+data.sell);
                        $(".bitfinex span:nth-of-type(4)").text("buy:"+data.buy);
                        bf = true;

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
                    }

                    $.ajax({
                        type: "GET",
                        url: "https://quiet-hamlet-43198/getDataKraken",
                        datatype: "json"
                    })
                    .done(function(data){
                        if(data.sell==0 || data.buy==0){
                            $(".kraken").parent().addClass("null");
                            $(".kraken span").text("");
                        }
                        else{
                            if(count==0)$(".kraken span").text("-");
                            var kraken = {
                                sell: data.sell,
                                buy: data.buy
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
                        }
                        
                        $.ajax({
                            type: "GET",
                            url: "https://quiet-hamlet-43198/getDataCex",
                            datatype: "json"
                        })
                        .done(function(data){
                    
                            
                            if(data.sell==0 || data.buy==0){
                                $(".cex").parent().addClass("null");
                                $(".cex span").text("");
                            }
                            else{
                                if(count==0)$(".cex span").text("-");
                                var cex = {
                                    sell: data.sell,
                                    buy: data.buy
                                }
                                $(".cex span:nth-of-type(3)").text("sell:"+data.sell);
                                $(".cex span:nth-of-type(4)").text("buy:"+data.buy);
                                cx = true;

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
                                setTimeout(runAjax, 5000,count+1);
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

    runAjax(0);
});