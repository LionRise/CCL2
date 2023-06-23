//Chat server
//WebSocket is a protocol that allows for full-duplex communication between a server and clients
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

//this is the websocket server. It listens for incoming connections and messages
wss.on("connection", (ws) => {
    ws.room = "";
    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
        let msg = JSON.parse(message);
        //This is where we handle the message. It is a simple echo server. Joining a room is handled here. It works like this: {joinRoom: "room1"} or {room: "room1", message: "Hello World!"}, where "room1" is the name of the room
        // and "Hello World!" is the message that will be sent to all clients in the room.
        if(msg.joinRoom) {ws.room = msg.joinRoom}
        if(msg.room) {websocketSendToAll(JSON.stringify(msg))}
    });
    ws.send(JSON.stringify({message: "Hello! Message from Server!!"}));
});

//This function sends a message to all connected clients
function websocketSendToAll(text) {
    wss.clients.forEach(function each(client) {
        if(client.readyState === WebSocket.OPEN) {
            if (client.room === JSON.parse(text).room) {
                client.send(text);
            }
        }
    });
}