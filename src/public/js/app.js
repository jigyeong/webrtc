const socket = io(); // io : Automatically search running socket function

const myFace = document.getElementById("myFace");
const audioBtn = document.getElementById("audioBtn")
const cameraBtn = document.getElementById("cameraBtn")
const cameraSelect = document.getElementById("cameras")

let myStream = null;
let audioMuted = false;
let cameraMuted = false;

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
getMedia();

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