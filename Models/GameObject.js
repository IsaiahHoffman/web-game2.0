class GameObject {
    constructor(id, object, user) {
        this.id = id
        this.username = user
        this.shapes = []
        for (let i = 0; i < object.shapes.length; i++){
            this.shapes[this.shapes.length] = object.shapes[i]
        }
        this.x = 0
        this.y = 0
        this.smallX = 0
        this.bigX = 0
        this.smallY = 0
        this.bigY = 0
        for (let i = 0; i < this.shapes.length; i++) {
            if (this.shapes[i].x < this.smallX) {
                this.smallX = this.shapes[i].x
            }
            if (this.shapes[i].y < this.smallY) {
                this.smallY = this.shapes[i].y
            }
            if (this.shapes[i].x + this.shapes[i].width < this.bigX) {
                this.bigX = this.shapes[i].x + this.shapes[i].width
            }
            if (this.shapes[i].y + this.shapes[i].height < this.bigY) {
                this.bigY = this.shapes[i].y + this.shapes[i].height
            }
        }
    }
    add(object) {
        this.shapes[this.shapes.length] = object
        if (object.x < this.smallX) {
            this.smallX = object.x
        }
        if (object.y < this.smallY) {
            this.smallY = object.y
        }
        if (object.x + object.width < this.bigX) {
            this.bigX = object.x + object.width
        }
        if (object.y + object.height < this.bigY) {
            this.bigY = object.y + object.height
        }
    }
}

module.exports = GameObject