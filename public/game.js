function cir(x, y, rad, color) {
    gl.beginPath();
    gl.arc(x, y, rad, 0, 2 * Math.PI);
    gl.fillStyle = color;
    gl.fill();
    gl.closePath()
}

function rect(x, y, w, h, color) {
    gl.beginPath();
    gl.rect(x, y, w, h);
    gl.fillStyle = color;
    gl.fill();
    gl.closePath()
}

let user = document.getElementById('username').innerHTML
if (user == "NOTLOGGEDIN") {
    window.location.href = "/"
}

const canvas = document.querySelector("canvas")
const gl = canvas.getContext('2d')
if (gl == null) {
    alert('Webgl not supported')
}
let canW = canvas.width
let canH = canvas.height
let speed = 2
let fps = 30
fps = 1000 / fps
let mouseX = 0
let mouseY = 0
let test = ""
let movingObject = null
let X = 0
let Y = 0
let dataToUpload = [{ id: user, canW: canW, canH: canH, cmX:mouseX, cmY:mouseY, x: X, y: Y }, null]

async function draw() {
    // -----------------Pull Data--------------------- //
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var dataS = JSON.stringify(dataToUpload);
    const URL = 'game';
    const Res = fetch(URL, {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: dataS
    });
    dataToUpload = [{ id: user, canW: canW, canH: canH, cmX:mouseX, cmY:mouseY, x: X, y: Y }, null]
    const response = await Res;
    const data = await response.json();

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canW = canvas.width
    canH = canvas.height

    gl.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.length; i++) {
        switch (data[i].id) {
            case "Rect":
                rect(data[i].x, data[i].y, data[i].width, data[i].height, data[i].color)
            case "Cir":
                cir(data[i].x, data[i].y, data[i].rad, data[i].color)
        }
    }

    // -----------------Testing---------------------- //
    let div = document.getElementById('data2')
    div.innerHTML = "KeyX: " + X + " KeyY: " + Y + "      " + "MosX: " + mouseX + " MosY: " + mouseY + " " + test
}

// ---------------------Event Functions------------------------ //

// Mouse Events
window.addEventListener("click", function (e) {
    getCursorPosition(canvas, e)
})

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    //console.log("x: " + x + " y: " + y)
    dataToUpload[1] = {
        id: "click",
        x: x,
        y: y
    }
}

function mousemove(event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    // console.log("x: " + x + " y: " + y)
    mouseX = x
    mouseY = Math.ceil(y)
    if (movingObject != null) {
        movingObject.x = mouseX
        movingObject.y = mouseY
    }
}

window.addEventListener('mousemove', mousemove);


// Movement
window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);

var keys = [];

function keysPressed(e) {
    // store an entry for every key pressed
    keys[e.keyCode] = true;

    // left
    if (keys[37]) {
        X -= speed;
    }

    // right
    if (keys[39]) {
        X += speed;
    }

    // down
    if (keys[38]) {
        Y -= speed;
    }

    // up
    if (keys[40]) {
        Y += speed;
    }
    e.preventDefault();
}

function keysReleased(e) {
    // mark keys that were released
    keys[e.keyCode] = false;
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
async function fun() {
    while (true) {
        await sleep(fps);
        draw()
    }
}
fun();  