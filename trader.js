


exports.dumbTrader = function(){
    global.buyPosition('FOO',54342, 101);
    global.sellPosition('FOO', 53, 100);
    setTimeout(exports.dumbTrader, 2000);
}
