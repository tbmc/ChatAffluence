/**
 * Created by tbmc on 23/06/2017.
 */

let express = require("express")
let app = express()
let server = require("http").createServer(app)
let io = require("socket.io")(server)

let clients = []


// Connection of a new client
io.on("connection", client => {
  
  client.on("pseudo", pseudo => {
    // Disconnect client if his pseudo is already taken
    if(clients.indexOf(pseudo) !== -1) {
      client.disconnect()
      return
    }
    client.pseudo = pseudo;
    clients.push(pseudo)
  })
  
  client.on("disconnect", () => {
    let idx = clients.indexOf(client.pseudo)
    if(idx !== -1) {
      clients.splice(idx, 1)
    }
    client.broadcast.emit("join", `${client.pseudo} has disconnected`)
  })
  
  // Broadcast to all other client that a new client has joined
  client.on("join", data => {
    client.broadcast.emit("join", `${client.pseudo} has joined`)
  })
  
  // Send message to all clients
  client.on("messages", message => {
    if(message.length < 1)
      return
    let pseudo = client.pseudo
    io.sockets.emit("messages", { message, pseudo })
  })
})


// Serve static files
app.use(express.static(__dirname + "/public"))
// Listen on port 3000
server.listen(3000, () => console.log("Listen on port 3000"))
