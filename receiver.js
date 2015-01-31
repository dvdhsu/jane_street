var net = require('net');
var model = require('./model.js');
var trader = require('./trader.js');

var TEST_EXCH_PRIVATE_IP = '10.0.146.192';
var TEST_EXCH_PUBLIC_IP = '54.154.185.161';
var HOST = TEST_EXCH_PRIVATE_IP;
var PORT = 25000;

var TEAM_NAME = 'POMEGRANATE';

console.log("PLEASE WORK");
global.socket = new net.Socket();
global.socket.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);

    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    var helloMsg = JSON.stringify({type: 'hello', team: TEAM_NAME});
    global.send(helloMsg);

    trader.dumbTrader();
    //global.buyPosition('FOO',54342, 142);
    //global.sellPosition('FOO', 53, 226);
});


// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
global.socket.on('data', function(unparsed_data) {
    global.logPosition();
    var lines = unparsed_data.toString().split('\n');
    for (var i =0; i != lines.length; ++i){
        try {
            parsed_data = JSON.parse(lines[i]);
        }
        catch (err) {
            continue;
        }
        switch(parsed_data["type"]) {
            case "hello":
                global.cash = parsed_data.cash;
                for (var i = 0; i < parsed_data.symbols.length; ++i) {
                    ticker = parsed_data.symbols[i];
                    global.symbols[ticker.symbol] = ticker.position;
                }
                global.market_opened = parsed_data.market_open;
                break;

            case "market_open":
                global.market_opened = parsed_data.open;
                break;
            case 'fill':
                global.notifyFill(parsed_data)
                break;
            case 'ack':
                break;
            case 'reject':
                global.notifyReject(parsed_data);
                break;
                // etc. with cases
        }
    }
});

// Add a 'close' event handler for the client socket
global.socket.on('close', function() {
    console.log('Connection closed');
});
