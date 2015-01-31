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

}

function getSellPriceWithQuantityAtLeast100(symbol) {

}

function getPercentageSpread(symbol) {

}

function getSymbolWithSpreadAbove(percent) {

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
    console.log("global.getCorgeCompositeBuyValue: " + global.getCorgeCompositeBuyValue());
    console.log("global.getCorgeCompositeSellValue: " + global.getCorgeCompositeSellValue());
    console.log("global.getCorgeActualBuyValue: " + global.getCorgeActualBuyValue());
    console.log("global.getCorgeActualSellValue: " + global.getCorgeActualSellValue());
}

global.getCorgeCompositeBuyValue = function() {
    return global.book.FOO.buy[0] * 0.3 + global.book.BAR.buy[0] * 0.8;
}

global.getCorgeCompositeSellValue = function() {
    return global.book.FOO.sell[0] * 0.3 + global.book.BAR.sell[0] * 0.8;
}

global.getCorgeActualBuyValue = function() {
    return global.book.CORGE.buy;
}

global.getCorgeActualSellValue = function() {
    return global.book.CORGE.sell;
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
