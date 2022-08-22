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

    socket.onAny((event)=>{
        console.log(`Socket Event : ${event}`);
    })
    socket.on("enter_room", (msg, done) => {
        socket.join(msg.payload)
        console.log(socket.rooms) // See all connections
        done();
        socket.to(msg.payload).emit("welcome") // Send Except me
    })
})

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);