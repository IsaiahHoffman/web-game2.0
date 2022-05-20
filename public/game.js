class User {
    constructor(username, password, x, y) {
        this.username = username
        this.password = password
        this.x = x
        this.y = y
    }
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
let speed = 2
let deltaX = 0
let deltaY = 0


function drawCircle(x, y, color) {
    gl.beginPath();
    gl.arc(x, y, 20, 0, 2 * Math.PI);
    gl.fillStyle = color;
    gl.fill();
    gl.closePath()
}

async function draw() {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var dataS = JSON.stringify({
        "deltaX": deltaX,
        "deltaY": deltaY,
        "name": user
    });

    const URL = 'http://10.0.0.153:5000/game';
    const Res = fetch(URL, {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: dataS
    });
    const response = await Res;
    const players = await response.json();

    gl.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(deltaX, deltaY, 'rgba(200,200,100,0.8)')
    for (let z = 0; z < players.length; z++) {
        if (players[z].username != user){
            drawCircle(players[z].x, players[z].y, 'rgba(100,100,100,0.8)')
        }
    }
    let div = document.getElementById('data2')
    div.innerHTML = "X: " + deltaX + "  Y: " + deltaY + "\n" //+ players

    //window.requestAnimationFrame(draw)
}

// Movement
window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);

var keys = [];

function keysPressed(e) {
    // store an entry for every key pressed
    keys[e.keyCode] = true;

    // left
    if (keys[37]) {
        deltaX -= speed;
    }

    // right
    if (keys[39]) {
        deltaX += speed;
    }

    // down
    if (keys[38]) {
        deltaY -= speed;
    }

    // up
    if (keys[40]) {
        deltaY += speed;
    }

    e.preventDefault();

    //draw();
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
        await sleep(50);
        draw()
    }
}
fun();  