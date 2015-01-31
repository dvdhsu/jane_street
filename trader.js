var model = require('./model.js');
exports.dumbTrader = function(){
    //global.buyPosition('FOO',54342, 101);
    //global.sellPosition('FOO', 53, 100);
    //global.convertToCorge(100);
    //global.convertFromCorge(100);
    //global.sellCorge(102);
    setTimeout(exports.dumbTrader, 2000);
	try {
	    global.logCorge();
	var fairCorgeBuyVal = global.getCorgeCompositeBuyValue();
	var fairCorgeSellVal = global.getCorgeCompositeSellValue();

	var acCorgeBuyVal = global.getCorgeActualBuyValue();
	var acCorgeSellVal = global.getCorgeActualSellValue();

console.log("Symbols with spread above 0.5");
//    console.log(global.getSymbolsWithSpreadAbove(0.5));
}
	catch(err){
	console.log(err);
	return;
}
	if (acCorgeBuyVal > fairCorgeBuyVal){
		console.log('OK CONVERTING TO CORGE');
		var fooPrice = global.book.FOO.buy[0][0];
		var barPrice = global.book.BAR.buy[0][0];
		global.buyPosition('FOO', fooPrice, 30);
		global.buyPosition('BAR', fooPrice, 80);
		global.convertToCorge(100);
		global.sellPosition('CORGE', acCorgeBuyVal - 3, 100);
	}
	if (acCorgeSellVal < fairCorgeSellVal){
		console.log('OK CONVERTING OUT OF CORGE');
		var fooPrice = global.book.FOO.buy[0][0];
		var barPrice = global.book.BAR.buy[0][0];
		global.buyPosition('CORGE', acCorgeSellVal, 100);
		global.convertOutOfCorge(100);
		global.sellPosition('FOO', fooPrice, 30);
		global.sellPosition('BAR', fooPrice, 80);
	} else {
		console.log("WHY");
	}
}


exports.startTrader = function(){

}

/** variables for pennying **/
var penny_prices = {
    "FOO": 0,
    "BAR": 0,
    "BAZ": 0,
    "QUUX": 0,
    "CORGE": 0
};


exports.notifyBookChange = function(symbol){
    if (symbol == "FOO" || symbol == "BAR" || symbol == "CORGE") {
            // consider equities
     }
     else {
         // see if we can liquidate our current stock at profit
     }

     // penny it
     max_buy_price = global.book[symbol].buy[0][0];
     max_buy_shares = global.book[symbol].buy[0][1];

     min_sell_price = global.book[symbol].sell[0][0];
     max_sell_shares = global.book[symbol].sell[0][1];

     // if it's less than 10 shares, probably somebody is trying to make up mess up.
     // So, we ignore it.
     // Must also be greater than our last bid price
     // They must also be two away
     if (max_buy_shares > 10 && max_buy_price > penny_prices[symbol] && max_buy_price + 1 < min_sell_price - 1) {
         our_buy_price = max_buy_price + 1;
         // hard-code to 100
         our_buy_shares = 100;
         our_sell_price = min_sell_price - 1;
         console.log("we're about to penny " + symbol + " at " + our_buy_price);
         global.cancelPosition(global.prev_pennied_order_id[symbol]);
         global.prev_pennied_order_id[symbol] = global.buyPosition(symbol, our_buy_price, our_buy_shares);
         penny_prices[symbol] = our_buy_price;
         // sell this later, when it's confirmed
         //global.sellPosition(symbol, our_sell_price, our_buy_shares);
     }
}

exports.notifyBuy = function(buy_data){
    //DO SOMETHING 

}

exports.notifySell = function(sell_data){
    //DO SOMETHING WITH IT

}

