const socket = io(); // io : Automatically search running socket function

const myFace = document.getElementById("myFace");
const audioBtn = document.getElementById("audioBtn")
const cameraBtn = document.getElementById("cameraBtn")
const cameraSelect = document.getElementById("cameras")
const call = document.getElementById("call")
call.hidden = true;

let myStream = null;
let audioMuted = false;
let cameraMuted = false;
let roomName;
let myPeerConnection;

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices()
        const cameras = devices.filter(device=> device.kind ==='videoinput')
        const currentCamera = myStream.getVideoTracks();
        cameras.forEach(camera=>{
            const option = document.createElement("option")
            option.value = camera.deviceId
            option.innerText = camera.label;
            if(currentCamera.label===camera.label){
                option.selected = true
            }
            cameraSelect.appendChild(option)
        })
        console.log(cameras)
    }
    catch(e){
        console.log(e)
    }
}

async function getMedia(deviceId){
    const initialConstraints = { audio: true, video: { facingMode: "user" } } ;
    const cameraConstraints = {
        audio : true,
        video : { deviceId : { exact : deviceId} }
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(deviceId?cameraConstraints:initialConstraints);
        console.log(myStream)
    }
    catch (e){

    }
    myFace.srcObject = myStream;
    if(!deviceId){
        await getCameras();
    }
}

function handleAudioClick(){
    myStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled 
    });
    audioMuted = !audioMuted
    if(!audioMuted){
        audioBtn.innerText ="Audio Unmute"
    }
    else 
    audioBtn.innerText ="Audio Mute"
}
function handleCameraClick(){
    myStream.getVideoTracks().forEach(track=>{
        track.enabled = !track.enabled
    });
    
    cameraMuted = !cameraMuted
    if(!cameraMuted) cameraBtn.innerText = "Camera On"
    else cameraBtn.innerText = "Camera Off"
}

async function handleCameraChange(){
    await getMedia(cameraSelect.value)
}

audioBtn.addEventListener("click", handleAudioClick)
cameraBtn.addEventListener("click", handleCameraClick)
cameraSelect.addEventListener("input", handleCameraChange)

// Welcome Form

const welcome = document.getElementById("welcome")
const welcomeForm = welcome.querySelector("form")

async function startMedia(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input")
    socket.emit("join_room", input.value, startMedia);
    roomName = input.value;
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit)

// Socket Code
socket.on("welcome", async ()=> {
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer)
    console.log("sent the offer", offer)
    socket.emit("offer", offer, roomName)
});

socket.on("offer",offer=>{
    console.log(offer)
})

// RTC Code
function makeConnection(){
    myPeerConnection = new RTCPeerConnection();
    myStream.getTracks().forEach(track => {
        myPeerConnection.addTrack(track, myStream)
    })
}