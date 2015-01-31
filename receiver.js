var net = require('net');
var model = require('./model.js')

var HOST = 'localhost';
var PORT = 5000;

var client = new net.Socket();
client.connect(PORT, HOST, function() {

  console.log('CONNECTED TO: ' + HOST + ':' + PORT);
  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
  // client.write('I am Chuck Norris!');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(unparsed_data) {
  parsed_data = JSON.parse(unparsed_data);
  console.log('DATA: ' + unparsed_data);
  console.log(global);

  switch(parsed_data["type"]) {
    case "hello":
      global.cash = parsed_data.cash;
      for (var ticker in parsed_data.symbols) {
        global.symbols[ticker.symbol] = ticker.position;
      }
      global.market_open = parsed_data.market_open;
      break;

    case "market_open":
      global.market_open = parsed_data.open;
      break;
      // etc. with cases
  }
  // Close the client socket completely
  //client.destroy();
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});
