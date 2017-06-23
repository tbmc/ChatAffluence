/**
 * Created by tbmc on 23/06/2017.
 */

// To hide and show component
let pseudoDiv = document.getElementById("pseudoDiv")
let messagesDiv = document.getElementById("messagesDiv")

let pseudoBtn = document.getElementById("pseudoBtn")

// Message components
let textArea = document.getElementById("message")
let messageList = document.getElementById("messageList")
let sendBtn = document.getElementById("send")

let socket;

pseudoBtn.addEventListener("click", e => {
  socket = io.connect(location.origin)
  let pseudo = document.getElementById("pseudo")
  socket.emit("pseudo", pseudo.value)
  
  initSocket()
})

function initSocket() {
  pseudoDiv.style.display = "none"
  messagesDiv.style.display = "initial"
  messageList.innerHTML = ""
  textArea.value = ""
  
  socket.on("disconnect", client => {
    pseudoDiv.style.display = "initial"
    messagesDiv.style.display = "none"
    
    // Remove because it can create multiple call if not removed
    sendBtn.removeEventListener("click", eventSendBtn, false)
  })
  
  socket.emit("join", "")
  
  // Event on button to send text
  let eventSendBtn = event => {
    let message = textArea.value
    textArea.value = ""
  
    if(message.length > 1) {
      socket.emit("messages", message)
    }
  }
  sendBtn.addEventListener("click", eventSendBtn, false)
  
  

// When a message is received
  socket.on("messages", m => {
    messageList.innerHTML += `<p><b>${m.pseudo} :</b> ${m.message}</p>`;
  })

// When a new user joins
  socket.on("join", text => {
    messageList.innerHTML += `<p class="bold">${text}</p>`;
  })
}
