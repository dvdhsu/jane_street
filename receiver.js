var net = require('net');
var model = require('./model.js')

var TEST_EXCH_PRIVATE_IP = '10.0.146.192';
var TEST_EXCH_PUBLIC_IP = '54.154.185.161';
var HOST = TEST_EXCH_PRIVATE_IP;
var PORT = 25000;

var TEAM_NAME = 'POMEGRANATE';

console.log("PLEASE WORK");
var client = new net.Socket();
client.connect(PORT, HOST, function() {

  console.log('CONNECTED TO: ' + HOST + ':' + PORT);

  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
  var helloMsg = JSON.stringify({type: 'hello', team: TEAM_NAME});
  send_log(helloMsg);

});


function send_log(msg){
  console.log('Sending: ' + msg);
  msg += '\n';
  client.write(msg);
}

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(unparsed_data) {
  var lines = unparsed_data.toString().split('\n');
  for (var i =0; i != lines.length; ++i){
  console.log('line: ' + lines[i]);
try {
  parsed_data = JSON.parse(lines[i]);
}
catch (err) {
  console.log('Error: ' + err);
  continue;
}
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
}
  // Close the client socket completely
  //client.destroy();
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});
