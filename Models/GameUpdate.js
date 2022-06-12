const mongoose = require('mongoose')

const GameUpdate = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },

    users: {
        type: Object,
        required: true
    },
    
    map: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('GameUpdate', GameUpdate)