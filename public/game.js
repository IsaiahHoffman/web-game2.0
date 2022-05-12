let user = document.getElementById('username').innerHTML
if (user == "NOTLOGGEDIN") {
    window.location.href = "/"
}

class Player {
    constructor(x, y) {
        this.deltaX = x
        this.deltaY = y

        this.move = function (x, y) {
            this.deltaX += x
            this.deltaY += y
        }
        this.position = function () {
            return this.deltaX + " " + this.deltaY
        }
    }
}
const canvas = document.querySelector("canvas")
const gl = canvas.getContext('2d')
if (gl == null) {
    alert('Webgl not supported')
}
let speed = 2
let deltaX = 0
let deltaY = 0

function postData() {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var dataS = JSON.stringify({
        "deltaX": deltaX,
        "deltaY": deltaY,
        "name": user
    });
    fetch('http://10.140.86.105:5000/game', {
        method: 'post',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: dataS
    })
}

async function updatePost() {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'React Hooks PUT Request Example' })
    };
    const response = await fetch('http://10.140.86.105:5000/game', requestOptions);
    const data = await response.json();
    return await data
}


function drawCircle(x, y, color) {
    gl.beginPath();
    gl.arc(x, y, 20, 0, 2 * Math.PI);
    gl.fillStyle = color;
    gl.fill();
    gl.closePath()
}

async function draw() {
    // console.log(players)
    let players = eval(await updatePost())
    gl.clearRect(0, 0, canvas.width, canvas.height);
    for (let z = 0; z < players.length; z++) {
        if (players[z].username != user){
            drawCircle(players[z].x, players[z].y, 'rgba(100,100,100,0.8)')
        }
    }
    drawCircle(deltaX, deltaY, 'rgba(250,250,250,0.8)')
    postData()
    let div = document.getElementById('data2')
    div.innerHTML = "X: " + deltaX + "  Y: " + deltaY + "\n" + players

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