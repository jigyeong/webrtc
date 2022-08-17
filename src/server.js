import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"))

//router
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on('connection',(socket)=> {
    sockets.push(socket);
    socket["nickname"] = "Anony"
    socket.on("close",()=> console.log("closed~!"))
    socket.on("message",(m)=> {
        const message = JSON.parse(m);
        switch (message.type){
            case "new_message" :
                sockets.forEach(s=>s.send(`${socket.nickname} : ${message.payload}`))
            case "nickname" :
                socket["nickname"] = message.payload
        }
    })
})

server.listen(3000, handleListen);