if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
process.env.PWD = process.cwd()

const express = require('express');
const app = express();

// Database
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DATABASE_URL
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log("Mongodb connected")
    client.close();
});
const mongoose = require('mongoose')
const GameUpdate = require('./Models/GameUpdate')
mongoose.connect(process.env.DATABASE_URL)

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(process.env.PWD, 'public')))

app.use(express.json())

const User = require('./Models/User')
const Headquarter = require('./Models/Headquarter')
const Player = require('./Models/Player')
const Rect = require('./Models/Rect')
const Cir = require('./Models/Cir')
const Button = require('./Models/Button')
const Map = require('./Models/Map')
const GameObject = require('./Models/GameObject')

app.get('/', (req, res) => {
    res.redirect('/Login')
    res.end()
})

app.get('/Login', (req, res) => {
    res.render('Login')
    res.end()
})

app.post('/Login', (req, res) => {
    let name = req.body.username
    let pass = req.body.password
    let login = false

    for (let i = 0; i < users.length; i++) {
        if (users[i].username == name && users[i].password == pass) {
            login = true
        }
    }
    if (login) {
        loggingUser = name
        res.redirect('/game')
    } else {
        res.redirect('/Login')
    }
})

app.get('/CreateAccount', (req, res) => {
    res.render('CreateAccount.ejs')
    res.end()
})

app.post('/CreateAccount', (req, res) => {
    let name = req.body.username
    let pass = req.body.password
    let fail = false
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == name) {
            fail = true
        }
    }
    if (name == 'NOTLOGGEDIN' || name == '') {
        fail = true;
    }
    if (fail) {
        res.redirect('/CreateAccount')
    } else {
        let list = []
        for (let i = 0; i < 100; i++) {
            list[i] = false
        }
        const userX = new User(name, pass, list)
        users[users.length] = userX
        loggingUser = name
        res.redirect('/game')
    }
})


app.get('/game', (req, res) => {
    console.log(loggingUser)
    res.render('game.ejs', { username: loggingUser })
    loggingUser = ""
    res.end()
})

app.post('/game', (req, res) => {
    // console.log(req.body)
    let t = new Date()
    if (t.valueOf() - serverLastUpdate > 600000) {
        let gameupdate = new GameUpdate({
            time: getDate() + " " + getTime(),
            users: users,
            map: map.objects
        })
        gameupdate.save()
        serverLastUpdate = t.valueOf()
    }

    let user = req.body[0].id
    let int = -1
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == user) {
            int = i
        }
    }
    if (int > -1) {
        let canW = req.body[0].canW
        let canH = req.body[0].canH
        let dX = req.body[0].x
        let dY = req.body[0].y
        let mcX = req.body[0].cmX
        let mcY = req.body[0].cmY
        let mX = null
        let mY = null
        if (req.body[1] != null) {
            mX = req.body[1].x
            mY = req.body[1].y
        }

        // Dashboard rendering
        let dashboard = genDash(req.body[0].canW, req.body[0].canH, users[int].buttons)

        for (let i = 0; i < dashboard.length; i++) {
            if (dashboard[i] == null) {
                continue
            }
            if (dashboard[i].visible) {
                let current = dashboard[i].shape
                dataToSend[dataToSend.length] = current
            }
        }

        // Moving Object
        if (users[int].movingObject == null) {
            for (let i = 0; i < dashboard.length; i++) {
                if (dashboard[i] != null) {
                    if (dashboard[i].visible) {
                        if (mX != null && mY != null) {
                            switch (dashboard[i].shape.id) {
                                case "Rect":
                                    if (mX > dashboard[i].shape.x && mY > dashboard[i].shape.y && mX < dashboard[i].shape.x + dashboard[i].shape.width && mY < dashboard[i].shape.y + dashboard[i].shape.height) {
                                        users[int].buttons[i] = !users[int].buttons[i]
                                        //console.log(int)
                                        //console.log(users[int].buttons[i])
                                    }
                                // TODO case () more cases to check if cursor clicks on shape
                            }
                        }
                    }
                }
            }
        }
        if (users[int].movingObject != null) {
            users[int].movingObject.move(mcX, mcY)
        }
        if (mX != null && mY != null) {
            if (users[int].movingObject != null) {
                map.add(users[int].movingObject)
                users[int].movingObject = null
            }
        }
        if (mX != null && mY != null && users[int].movingObject == null) {
            for (let i = 26; i < 50; i++) {
                if (users[int].buttons[i]) {
                    switch (i) {
                        case 26:
                            users[int].movingObject = new Headquarter(mX, mY, 'rgba(100,200,200,1)')
                            users[int].buttons[i] = false

                    }
                }
            }
        }

        if (users[int].movingObject != null) {
            for (let i = 0; i < users[int].movingObject.shapes.length; i++) {
                dataToSend[dataToSend.length] = users[int].movingObject.shapes[i]
            }
        }

        // Map Objects
        for (let j = 0; j < map.objects.length; j++) {
            for (let i = 0; i < map.objects[j].shapes.length; i++) {
                dataToSend[dataToSend.length] = map.objects[j].shapes[i]
            }
        }

        let dataRes = JSON.stringify(dataToSend)
        dataToSend = []
        res.send(dataRes)

    }

})
async function pullData() {
    let data = await GameUpdate.find({})
    return data[data.length - 1]
}

let map = new Map(700, 700)
let users = []
let time = new Date()
let serverLastUpdate = time.valueOf()


pullData().then(res => { users = res.users, map.objects = res.map })

let dataToSend = []
let loggingUser = ""

function genDash(x, y, clicked) {
    let buttons = []
    for (let i = 0; i < 100; i++) {
        buttons[i] = null
    }
    // Static Buttons 0 - 25
    // Resource Bar
    buttons[0] = new Button(new Rect(0, 0, x, 25, 'rgba(100,100,100,1)'), true, clicked[0])
    // Profile
    buttons[1] = new Button(new Cir(35, 35, 50, 'rgba(100,200,100,1)'), true, clicked[1])

    // Build (B) buttons 25 - 50
    buttons[25] = new Button(new Rect(0, y - 50, 50, 50, 'rgba(100,100,100,1)'), true, clicked[25])
    // (B) HQ
    buttons[26] = new Button(new Rect(100, y - 50, 50, 50, 'rgba(100,100,100,1)'), buttons[25].clicked, clicked[26])
    // (B) Mine
    buttons[27] = new Button(new Rect(175, y - 50, 50, 50, 'rgba(100,100,100,1)'), buttons[25].clicked, clicked[27])
    return buttons
}

function getTime() {
    let time = new Date()
    return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()
}

function getDate() {
    let time = new Date()
    return time.getMonth() + "/" + time.getDate() + "/" + time.getFullYear()
}





///////////////////////////Testing/////////////////////
// let map1 = new Map(5000, 1000)
// console.log("done")








const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(
    `Server started on port ${PORT}`));