# THIS IS A STUPID SERVER


import socket
import time
import json
import random

serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(('localhost', 5000))
serversocket.listen(5) # 5 different socket connections



 #VARIANT ONE: Echo Server
#while True:
    #conn, addr = serversocket.accept()
    #buf = conn.recv(64)
    #conn.send(buf)


while True:
    conn, addr = serversocket.accept()
    time.sleep(1)
    random_obj = {}
    random_obj['type'] = 'market_open'
    random_obj['open'] = True
    conn.send(json.dumps(random_obj))
    
    while True:
        time.sleep(random.randint(1,5))
        random_obj = {}
        random_obj['type'] = 'book'
        random_obj['symbol'] = 'SYMBOL'
        random_obj['buy'] =[[10+random.random(), random.randint(30,40)], [10+random.random(), random.randint(30,40)]]
        random_obj['sell'] = []
        conn.send(json.dumps(random_obj))

