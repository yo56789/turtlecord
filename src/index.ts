import { Buffer } from 'buffer';
import { Server } from 'ws';
import Websocket = require('ws');
// import { Client, Intents } from 'discord.js';
// import { readFileSync } from 'fs';
import { SlashCommandBuilder } from '@discordjs/builders';
import discord from './discord';
import turtle from './turtle';

const cmds = [
    { name: 'test', description: 'test command to test if it will work WHILE a websocket is running' },
    { name: 'forward', description: 'moves the turtle forward' },
    { name: 'eval', description: 'evals some code on the turtle', options: [{ type: 3, name: 'code', description: 'the code to run', required: true }] }
];
const disclient = new discord(cmds);
const wss = new Server({ port: 5757 });

let turtlews: Websocket 

// interface Turtle {
//     turtle: Websocket;
// }
/*
*/
// ws.send("exit"); - exits program

wss.on('connection', function connection(ws) {
    let turtleC = new turtle(ws);
    // Add the turtle so the discord client can interact with the websocket connection
    disclient.addTurtle(turtleC);
    turtlews = ws;
    console.log("Turtle has connected..");
    let obj = { "type": "eval", "code": "return 1 + 1" };
    let data = Buffer.from(JSON.stringify(obj));
    ws.send(data);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
});

// Start the discord bot client
(async () => {
    await disclient.start();
})();