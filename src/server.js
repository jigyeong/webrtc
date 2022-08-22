import express from "express";
import {Server} from "socket.io";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"))

//router
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));


const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"] = "anonymous"
    socket.onAny((event)=>{
        console.log(`Socket Event : ${event}`);
    })
    socket.on("enter_room", (msg, done) => {
        socket.join(msg.payload)
        console.log(socket.rooms) // See all connections
        done();
        socket.to(msg.payload).emit("welcome", socket.nickname) // Send Except me
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye",socket.nickname))
    })
    socket.on("new_message", (msg, room, done)=>{
        socket.to(room).emit("new_message",`${socket.nickname} : ${msg}`);
        done();
    })
    socket.on("nickname", (nickname)=> socket["nickname"]=nickname)
})

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);