class Explosion extends Entity {
    constructor(position, temp) {
        super(position, 1, "red");
        this.temp = temp;
    }

    static create(position, velocity, temp) {
        let obj = new Particle(position, temp);
        obj.gravity = Vector.down().mult(0.25);
        obj.velocity = velocity;
        game.addEntity(obj);
        return obj;
    }

    update() {
        super.update();
        if (this.temp <= 0) {
            game.remove(this);
        }
        this.temp -= 0.1;

    }
}