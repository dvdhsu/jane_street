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
	} catch (err) {
		console.log(err);
	}

	// spread log
	//console.log("symbols with % spread above 0.2");
	//console.log(global.getSymbolsWithSpreadAbove(0.2));
	if (acCorgeBuyVal > fairCorgeSellVal){
		console.log('OK CONVERTING TO CORGE');
		var fooPrice = 0;
		var barPrice = 0;
		var i = 0;
		while (fooPrice < fairCorgeSellVal * 0.3){
			fooPrice = global.book.FOO.sell[i][0];
			i += 1;
		}
		var i = 0;
		while (barPrice  < fairCorgeSellVal * 0.8){
			barPrice  = global.book.BAR.sell[i][0];
			i += 1;
		}
		global.buyPosition('FOO', fooPrice, 30);
		global.buyPosition('BAR', barPrice, 80);
		global.convertToCorge(100);
		global.sellPosition('CORGE', acCorgeBuyVal, 100);
	}
	if (acCorgeSellVal < fairCorgeBuyVal){
		console.log('OK CONVERTING OUT OF CORGE');
		var fooPrice = 0;
		var barPrice = 0;
		var i = 0;
		while (fooPrice < fairCorgeSellVal * 0.3){
			fooPrice = global.book.FOO.buy[i][0];
			i += 1;
		}
		var i = 0;
		while (barPrice  < fairCorgeSellVal * 0.8){
			barPrice  = global.book.BAR.buy[i][0];
			i += 1;
		}
		global.buyPosition('CORGE', acCorgeSellVal, 100);
		global.convertOutOfCorge(100);
		global.sellPosition('FOO', fooPrice, 30);
		global.sellPosition('BAR', barPrice, 80);
	} else {
		console.log("WHY");
	}
}


exports.startTrader = function(){

}


exports.notifyBookChange = function(){
}

exports.notifyBuy = function(buy_data){
    //DO SOMETHING 

}

exports.notifySell = function(sell_data){
    //DO SOMETHING WITH IT

}

