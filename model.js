var trader = require('./trader.js');

var order_id = 0;
var order_id_to_order = {};
var prev_string = '';

function getNewOrderId(){
    order_id += 1;
    return order_id;
}

function addPosition(symbol, price, size, dir){
    var new_order_id = getNewOrderId();
    var orderObj = {
        type: 'add',
        order_id : new_order_id,
        symbol: symbol,
        dir: dir,
        price: price,
        size: size
    };
    var msg = JSON.stringify(orderObj);
    order_id_to_order[new_order_id] = msg;
    global.send(msg);
}

function getBuyPriceWithQuantityAtLeast100(symbol) {
    var buyArray = global.book.symbol.buy;
    var buyPrice = 0;
    for (x in buyArray) {
        if (x[1] >= 100) {
            buyPrice = x[0];
            break;
        }
    }
    // assert x!=0
    return x;
}

function getSellPriceWithQuantityAtLeast100(symbol) {
    var sellArray = global.book.symbol.sell;
    var sellPrice = 0;
    for (x in sellArray) {
        if (x[1] >= 100) {
            sellPrice = x[0];
            break;
        }
    }
    // assert x!=0
    return x;
}

function getPercentageSpread(symbol) {
    var bid = getBuyPriceWithQuantityAtLeast100(symbol);
    var offer = getSellPriceWithQuantityAtLeast100(symbol);
    return (offer-bid)/offer;
}

function getSymbolsWithSpreadAbove(percent) {
    var a = [];
    var listOfSymbols = ['FOO','BAR','BAZ','QUUX','CORGE'];
    for (x in listOfSymbols) {
        if (getPercentageSpread('FOO') > percent)
            a.push('FOO');
    }
    return a;
}


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

global.logCorge = function(){ 
    try {
	console.log("global.getCorgeCompositeBuyValue: " + global.getCorgeCompositeBuyValue());
	console.log("global.getCorgeCompositeSellValue: " + global.getCorgeCompositeSellValue());
	console.log("global.getCorgeActualBuyValue: " + global.getCorgeActualBuyValue());
	console.log("global.getCorgeActualSellValue: " + global.getCorgeActualSellValue());
    } catch(err){}
}

global.getCorgeCompositeBuyValue = function() {
    return global.book.FOO.buy[0][0] * 0.3 + global.book.BAR.buy[0][0] * 0.8;
}

global.getCorgeCompositeSellValue = function() {
    return global.book.FOO.sell[0][0] * 0.3 + global.book.BAR.sell[0][0] * 0.8;
}

global.getCorgeActualBuyValue = function() {
    return global.book.CORGE.buy[0][0];
}

global.getCorgeActualSellValue = function() {
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

global.notifyFill = function(parsed_data){
    if (parsed_data.dir == 'BUY'){
        global.symbols[parsed_data.symbol] += parsed_data.size;
        global.cash -= parsed_data.size * parsed_data.price;
    } else {
        global.symbols[parsed_data.symbol] -= parsed_data.size;
        global.cash += parsed_data.size * parsed_data.price;
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

global.buyPosition = function(symbol, price, size){
    addPosition(symbol, price, size, 'BUY');
}

global.sellPosition = function(symbol, price, size){
    addPosition(symbol, price, size, 'SELL');
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
