if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())


const User = require('./Models/User')
let users = []
let loggingUser = ""
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
    if (name == 'NOTLOGGEDIN' || name == ''){
        fail = true;
    }
    if (fail) {
        res.redirect('/CreateAccount')
    } else {
        const userX = new User(name, pass, 0, 0)
        users[users.length] = userX
        loggingUser = name
        res.redirect('/game')
    }
})


app.get('/game', (req, res) => {
    console.log(loggingUser)
    res.render('game.ejs', {username:loggingUser})
    loggingUser = ""
    res.end()
})

app.post('/game', (req, res) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == req.body.name) {
            users[i].x = req.body.deltaX
            users[i].y = req.body.deltaY
        }
    }
    let dataRes = JSON.stringify(users)
    res.send(dataRes)
})







const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(
    `Server started on port ${PORT}`));