class Player {
    constructor(name) {
        this.name = name
        this.objects = []
        this.X = 0
        this.Y = 0
    }
    add(object){
        this.objects[this.objects.length] = object
    }
}


module.exports = Player