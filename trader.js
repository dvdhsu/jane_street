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


exports.notifyBookChange = function(){
}

exports.notifyBuy = function(buy_data){
    //DO SOMETHING 

}

exports.notifySell = function(sell_data){
    //DO SOMETHING WITH IT

}

