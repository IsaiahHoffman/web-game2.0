const Building = require("./Building")
const Rect = require("./Rect")

class Headquarter extends Building{
    constructor(x, y, color) {
        super(x, y)
        this.color = color
        this.shapes = []
        this.id = "HQ"

        // Draw
        this.shapes[0] = new Rect(this.x - 25, this.y - 25, 50, 50, this.color)
    }

    move(x, y){
        this.shapes[0] = new Rect(x - 25, y - 25, 50, 50, this.color)
    }

}


module.exports = Headquarter