var trader = require('./trader.js');

var order_id = 0;
var order_id_to_order = {};
var prev_string = '';

var QUANTITY = 100.0;
var F = QUANTITY  * .3;
var B = QUANTITY * .8;

global.F = F;
global.B = B;
global.Q = QUANTITY;
global.executingEtf = false;
global.lastEtfId = -100000;

global.spreadId = 1000;

global.socket;
global.cash;
global.market_opened;
global.symbols = {};
global.book = {
    "FOO": {
        "buy": [],
        "sell": []
    },
    "BAR": {
        "buy": [],
        "sell": []
    },
    "BAZ": {
        "buy": [],
        "sell": []
    },
    "QUUX": {
        "buy": [],
        "sell": []
    },
    "CORGE": {
        "buy": [],
        "sell": []
    }
};

function min(x,y){
	if (x < y){return x;}
	return y;
}

function getNewOrderId(){
    order_id += 1;
    return order_id;
}

function addPosition(symbol, price, size, dir, id){
    var new_order_id;
	if (id < 0 || id == null) new_order_id  = getNewOrderId();
	else new_order_id = id;
    var orderObj = {
        type: 'add',
        order_id : new_order_id,
        symbol: symbol,
        dir: dir,
        price: Math.round(price),
        size: size
    };
    var msg = JSON.stringify(orderObj);
    order_id_to_order[new_order_id] = msg;
    global.send(msg);
	return new_order_id;
}

global.spreadBalance = 1000;
global.buySpreadPrice = [];
global.sellSpreadPrice = [];

global.getMiddleSpreadPrice = function(symbol) {
    return global.buySpreadPrice[symbol] + (global.sellSpreadPrice[symbol]-global.buySpreadPrice[symbol]);
}

function getBuyPriceWithQuantityAtLeast100(symbol) {
    var buyArray = global.book[symbol].buy;
    var buyPrice = 0;
	var x;
<<<<<<< HEAD

=======
>>>>>>> a72511d926c74f6dc16359b2d59f5702da300b29
    for (i in buyArray) {
        x = buyArray[i];
        if (x[1] >= 100) {
            buyPrice = x[0];
            break;
        }
    }
        global.buySpreadPrice[symbol] = buyPrice;
    // assert x!=0

    return parseInt(x);
}

function getSellPriceWithQuantityAtLeast100(symbol) {
    var sellArray = global.book[symbol].sell;
    var sellPrice = 0;
    for (i in sellArray) {
        var x = sellArray[i];
        if (x[1] >= 100) {
            sellPrice = x[0];
            break;
        }
    }
        global.sellSpreadPrice[symbol] = sellPrice;
    // assert x!=0
    return parseInt(x);
}

function getPercentageSpread(symbol) {
    var bid = getBuyPriceWithQuantityAtLeast100(symbol); 
    var offer = getSellPriceWithQuantityAtLeast100(symbol); 
    return (offer-bid)/offer;
}

global.getSymbolsWithSpreadAbove = function(percent) {
    var a = [];
    var listOfSymbols = ['FOO','BAR','BAZ','QUUX','CORGE'];
    for (var i in listOfSymbols) {
        var x = listOfSymbols[i];
        if (getPercentageSpread(x) > percent)
            a.push(x);
    }
    return a;
}


global.logCorge = function(){ 
		console.log("global.getCorgeCompositeBuyValue: " + global.getCorgeCompositeBuyValue());
		console.log("global.getCorgeCompositeSellValue: " + global.getCorgeCompositeSellValue());
		console.log("global.getCorgeActualBuyValue: " + global.getCorgeActualBuyValue());
		console.log("global.getCorgeActualSellValue: " + global.getCorgeActualSellValue());
}

global.getCorgeCompositeBuyValue = function() {
	var fooQ = 0;
	var fooP = 0;
	var i = 0;
	while (fooQ < F && i < global.book.FOO.buy.length){
		p_ = global.book.FOO.buy[i][0];
		q_ = global.book.FOO.buy[i][1];
		i += 1;
		fooP += p_ * min(F - fooQ, q_);
		fooQ += q_;
	}

	if (fooQ < F){
		throw "not enough q";
	}

	var fooPrice = fooP / F;
	var barQ = 0;
	var barP = 0;
	var i = 0;
	while (barQ < B && i < global.book.BAR.buy.length){
		p_ = global.book.BAR.buy[i][0];
		q_ = global.book.BAR.buy[i][1];
		i += 1;
		barP += p_ * min(B - barQ, q_);
		barQ += q_;
	}
	if (barQ < B){
		throw "not enough b";
	}
	var barPrice = barP / B;
	return fooPrice * 0.3 + barPrice * 0.8;
    //return global.book.FOO.buy[0][0] * 0.3 + global.book.BAR.buy[0][0] * 0.8;
}

global.getCorgeCompositeSellValue = function() {
	var fooQ = 0;
	var fooP = 0;
	var i = 0;
	while (fooQ < F && i < global.book.FOO.sell.length){
		p_ = global.book.FOO.sell[i][0];
		q_ = global.book.FOO.sell[i][1];
		i += 1;
		fooP += p_ * min(F - fooQ, q_);
		fooQ += q_;
	}
	if (fooQ < F){
		throw "not enough q";
	}
	var fooPrice = fooP / F;

	var barQ = 0;
	var barP = 0;
	var i = 0;
	while (barQ < B && i < global.book.BAR.sell.length){
		p_ = global.book.BAR.sell[i][0];
		q_ = global.book.BAR.sell[i][1];
		i += 1;
		barP += p_ * min(B - barQ, q_);
		barQ += q_;
	}
	if (barQ < B){
		throw "not enough b";
	}
	var barPrice = barP / B;
	return fooPrice * 0.3 + barPrice * 0.8;
    //return global.book.FOO.sell[0][0] * 0.3 + global.book.BAR.sell[0][0] * 0.8;
}

global.getCorgeActualBuyValue = function() {
	var corgeQ = 0;
	var corgeP = 0;
	var maxP = 0;
	var i = 0;
	while (corgeQ < QUANTITY && i < global.book.CORGE.buy.length){
		p_ = global.book.CORGE.buy[i][0];
		q_ = global.book.CORGE.buy[i][1];
		i += 1;
		corgeP += p_ * min(QUANTITY - corgeQ, q_);
		corgeQ += q_;
	}
	if (corgeQ < QUANTITY){
		throw "not enough q";
	}
	return corgePrice = corgeP / QUANTITY;
    //return global.book.CORGE.buy[0][0];
}

global.getCorgeActualSellValue = function() {
	var corgeQ = 0;
	var corgeP = 0;
	var i = 0;
	while (corgeQ < QUANTITY && i < global.book.CORGE.sell.length){
		p_ = global.book.CORGE.sell[i][0];
		q_ = global.book.CORGE.sell[i][1];
		i += 1;
		corgeP += p_ * min(QUANTITY - corgeQ, q_);
		corgeQ += q_;
	}
	if (corgeQ < QUANTITY){
		throw "not enough q";
	}
	return corgePrice = corgeP / QUANTITY;
    return global.book.CORGE.sell[0][0];
}

global.notifyAccepted = function(parsed_data){
	var order_id = parsed_data.order_id;
	var order = JSON.parse(order_id_to_order[order_id]);
	if (order.symbol == 'CORGE'){
		var size = order.size;
		var fooSize = size * 0.3;
		var barSize = size * 0.8;
		if (order.dir == 'BUY'){
			global.symbols.FOO -= fooSize;
			global.symbols.BAR -= barSize;
			global.symbols.CORGE += size;
		} else {
			global.symbols.FOO += fooSize;
			global.symbols.BAR += barSize;
			global.symbols.CORGE -= size;
		}
		global.cash -= 100;// 100 dollar fee bro
	}
}

global.incrementSpreadId = function() {
	if (global.spreadId<1999) global.spreadId+=1;
	else global.spreadId=1000;
};

global.notifyFill = function(parsed_data){
    if (parsed_data.dir == 'BUY'){
        global.symbols[parsed_data.symbol] += parsed_data.size;
        global.cash -= parsed_data.size * parsed_data.price;
	var id = parsed_data.order_id;
        if (id>=1000 && id < 2000) {
                global.spreadBalance -= parsed_data.size;
		console.log("Bought " + parsed_data.symbol + " @ " + parsed_data.price);
		console.log("Spread balance: " + global.spreadBalance);
		global.incrementSpreadId();
                global.sellPosition(parsed_data.symbol, parsed_data.price+10, parsed_data.size, 1000);
        }
    } else {
        global.symbols[parsed_data.symbol] -= parsed_data.size;
        global.cash += parsed_data.size * parsed_data.price;
	var id = parsed_data.order_id;
        if (id>=1000 && id < 2000) {
                console.log("Sold " + parsed_data.symbol + " @ " + parsed_data.price);
                global.spreadBalance += parsed_data.size;    
		console.log("Spread balance: " + global.spreadBalance);
        }
    }
}

global.logPosition= function(){
    var string2log = 'cash: ' + global.cash + '\n' + 'market opened: ' + global.market_opened + '\n';
    for (var symbol in global.symbols){
        string2log += 'Symbol: ' + symbol + ', position: ' + global.symbols[symbol] + '\n';
    }
    if (string2log != prev_string){
        console.log(string2log);
        prev_string = string2log;
    }
}

global.send = function(msg){
  console.log('Sending: ' + msg);
  msg += '\n';
  global.socket.write(msg);
}

global.buyPosition = function(symbol, price, size, id){
    return addPosition(symbol, price, size, 'BUY', id);
}

global.sellPosition = function(symbol, price, size, id){
    return addPosition(symbol, price, size, 'SELL', id);
}

global.convertToCorge  = function(quantity){
    var new_order_id = getNewOrderId();
    var orderObj = {
        type: 'convert',
        order_id : new_order_id,
        symbol: 'CORGE',
        dir: 'BUY',
        size: quantity
    };
    var msg = JSON.stringify(orderObj);
    order_id_to_order[new_order_id] = msg;
    global.send(msg);
}

global.convertOutOfCorge  = function(quantity){
    var new_order_id = getNewOrderId();
    var orderObj = {
        type: 'convert',
        order_id : new_order_id,
        symbol: 'CORGE',
        dir: 'SELL',
        size: quantity
    };
    var msg = JSON.stringify(orderObj);
    order_id_to_order[new_order_id] = msg;
    global.send(msg);
}
