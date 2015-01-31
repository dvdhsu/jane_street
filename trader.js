


exports.dumbTrader = function(){
    global.buyPosition('FOO',54342, 100);
    global.sellPosition('FOO', 53, 100);
    setTimeout(exports.dumbTrader, 2000);
}
