var order_id = 0;
var order_id_to_order = {};
var prev_string = '';

function getNewOrderId(){
    order_id += 1;
    return order_id;
}


global.socket;
global.cash;
global.market_opened;
global.symbols = {};

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
    var new_order_id = getNewOrderId();
    var orderObj = {
        type: 'add',
        order_id : new_order_id,
        symbol: symbol,
        dir: 'BUY',
        price: price,
        size: size
    };
    var msg = JSON.stringify(orderObj);
    order_id_to_order[new_order_id] = msg;
    global.send(msg);

}

