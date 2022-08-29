import express from "express";
import { Server } from "socket.io";
import http from "http";
import { instrument } from "@socket.io/admin-ui"

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"))

//router
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));


const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});

instrument(wsServer, {
    auth: false
});

wsServer.on("connection", (socket) => {
    socket.on("join_room",(roomName, done)=>{
        socket.join(roomName)
        done();
        socket.to(roomName).emit("welcome");
    })

    socket.on("offer", (offer, roomName)=>{
        socket.to(roomName).emit("offer", offer)
    })
})

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);