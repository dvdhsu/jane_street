var order_id = 0;
var order_id_to_order = {};

function getNewOrderId(){
    return order_id;
    order_id += 1;
}


global.socket;
global.cash;
global.market_opened;
global.symbols = {};

global.logPosition= function(){
    console.log('cash: ' + global.cash);
    console.log('market opened: ' + global.market_opened);
    for (var symbol in global.symbols){
        console.log('Symbol: ' + symbol + ', position: ' + global.symbols[symbol]);
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

