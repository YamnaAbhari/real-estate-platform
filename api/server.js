import "dotenv/config";
import mongoose from "mongoose";
import http from 'http'
import app, { allowedOrigins } from "./app.js";
import { Server } from "socket.io";
import { registerChatSocket } from "./Socket/index.js";

const PORT=process.env.PORT || 5001
mongoose.connect(process.env.DATA_BASE).then(()=>{
    console.log('DATA BASE CONNECTED')
}).catch(err=>{
    console.log(err)
})


const server=http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
registerChatSocket(io)

server.listen(PORT,()=>{
    console.log(`SERVER IS RUNNING IN PORT ${PORT}`)
})