import WebSocket from "ws";

export default class turtle {

    turtlea: WebSocket;
    constructor(turtle: WebSocket) {
        this.turtlea = turtle;
    }

    moveForward() {
        const data = Buffer.from(JSON.stringify({ "type": "eval", "code": "turtle.forward()" }));
        this.turtlea.send(data);
    }

    eval(code: string) {
        const data = Buffer.from(JSON.stringify({ "type": "eval", "code": code }));
        this.turtlea.send(data);
    }
}