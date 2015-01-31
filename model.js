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


order_ids = 0;
order_id_to_order = {};

global.buyPosition = function(symbol, price, size){
  
}

