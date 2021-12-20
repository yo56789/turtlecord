import { Server } from 'ws';
import { Buffer } from 'buffer';
import Websocket = require('ws');

const wss = new Server({ port: 5757 });

let turtle: Websocket 

/*
*/
// ws.send("exit"); - exits program

wss.on('connection', function connection(ws) {
    turtle = ws;
    console.log("Turtle has connected..");
    let obj = { "type": "eval", "code": "return 1 + 1" };
    let data = Buffer.from(JSON.stringify(obj));
    ws.send(data);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
});
