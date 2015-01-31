var net = require('net');
var model = require('./model.js')

var TEST_EXCH_PRIVATE_IC_IP = '10.0.146.192';
var TEST_EXCH_PUBLIC_IP = '54.154.186.161';
var HOST = TEST_EXCH_PRIVATE_IC_IP;
var PORT = 25002;

var client = new net.Socket();
client.connect(PORT, HOST, function() {

  console.log('CONNECTED TO: ' + HOST + ':' + PORT);

  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
  var helloMsg = JSON.stringify({type: 'hello', team: 'pomegranate'});
  send_log(helloMsg);

});


function send_log(msg){
  console.log('Sending: ' + msg);
  client.write(msg);
}

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
