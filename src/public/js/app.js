const messageList = document.querySelector("ul")
const messageForm = document.querySelector("form")
const socket = new WebSocket(`ws://${window.location.host}/`)

socket.addEventListener("open",() => {
    console.log("Connected to Browser")
})

socket.addEventListener("message", (m)=>{
    console.log("Receive message : ", m.data)
})

socket.addEventListener("close", () => {
    console.log("Closed from Server")
})

const handleSubmit = function(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    console.log(input.value)
    input.value="";
}
messageForm.addEventListener("submit", handleSubmit)