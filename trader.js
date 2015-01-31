exports.dumbTrader = function(){
    global.buyPosition('FOO',54342, 101);
    global.sellPosition('FOO', 53, 100);
    setTimeout(exports.dumbTrader, 2000);
}


exports.startTrader = function(){

}


exports.notifyBookChange = function(){
    //DO SOMETHING
}

exports.notifyBuy = function(buy_data){
    //DO SOMETHING 

}

exports.notifySell = function(sell_data){
    //DO SOMETHING WITH IT

}

