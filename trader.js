var model = require('./model.js');
exports.dumbTrader = function(){
    //global.buyPosition('FOO',54342, 101);
    //global.sellPosition('FOO', 53, 100);
    //global.convertToCorge(100);
    //global.convertFromCorge(100);
    //global.sellCorge(102);
    global.logPosition();
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

	console.log("Symbols with spread above 0.01");
	var highSpreadSymbols = global.getSymbolsWithSpreadAbove(0.01);
	console.log(highSpreadSymbols);
/*
	if (acCorgeBuyVal > fairCorgeSellVal){
		console.log('OK CONVERTING TO CORGE');
		var i = 1;
		var fooPrice = global.book.FOO.sell[i][0];
		var barPrice  = global.book.BAR.sell[i][0];
		global.buyPosition('FOO', fooPrice, global.F, -1);
		global.buyPosition('BAR', barPrice, global.B, -1);
		global.convertToCorge(global.Q);
		global.sellPosition('CORGE', acCorgeBuyVal, global.Q, -1);
	}
	if (acCorgeSellVal < fairCorgeBuyVal){
		console.log('OK CONVERTING OUT OF CORGE');
		var i = 1;
		var fooPrice = global.book.FOO.buy[i][0];
		var barPrice  = global.book.BAR.buy[i][0];
		global.buyPosition('CORGE', acCorgeSellVal, global.Q, -1);
		global.convertOutOfCorge(global.Q);
		global.sellPosition('FOO', fooPrice, global.F, -1);
		global.sellPosition('BAR', barPrice, global.B, -1);
	} else {
		console.log("WHY");
	}*/

	if (highSpreadSymbols.length > 0) {
        	for (var i in highSpreadSymbols) {
                	var x = highSpreadSymbols[i];
                	if (global.spreadBalance > 0) {
                     	   	var y = Math.round(global.getMiddleSpreadPrice(x));
         
                        	global.buyPosition(x, y, 100,global.spreadId);
				global.incrementSpreadId();
                        
                	}
        	}
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

