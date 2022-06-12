class Map {
    constructor(length, width) {
        this.length = length
        this.width = width
        this.objects = []
        this.layer1 = new Array(this.length)
        for (let b = 0; b < this.length; b++) {
            this.layer1[b] = new Array(this.width)
        }
        this.layer2 = []
        this.layer3 = []
        this.layer4 = []
        this.layer5 = []
        this.generate()
    }

    add(object) {
        this.objects[this.objects.length] = object
    }
    generate() {
        // for (let a = 0; a < this.length; a++) {
        //     for (let b = 0; b < this.length; b++) {
        //         let zero = 0
        //         let one = 0

        //         switch (this.layer1[a - 1][b]) {
        //             case 0:
        //                 zero += .25
        //             case 1:
        //                 one += .25
        //         }

        //         switch (this.layer1[a ][b - 1]) {
        //             case 0:
        //                 zero += .25
        //             case 1:
        //                 one += .25
        //         }
        //         this.layer1[a][b] = 0
        //     }
        // }
    }
}


module.exports = Map