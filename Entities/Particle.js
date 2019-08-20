class Particle extends Entity {
    constructor(position, temp, mass) {
        super(position, 1, 1, "red", mass);
        this.temp = temp;
    }

    static create(position, velocity, temp) {
        let obj = new Particle(position, temp, Math.random(16)+8);
        obj.gravity = Vector.down().mult(0.125);
        obj.velocity = velocity;
        game.addEntity(obj);
        return obj;
    }

    update() {
        super.update();
        if (this.temp <= 0) {
            game.remove(this);
        }
        this.temp -= 1;
        if (this.mass > 8) this.mass -= 1;
        this.color = "rgb(" + this.temp*100 + ", " + this.temp*50 + ",0)";

        if (this.outsideWorld()) {
            this.destroy();
        }
    }

    outsideWorld() {
        return (this.position.x < interactionDist || this.position.x > worldSize - interactionDist) || (this.position.y < interactionDist || this.position.y > worldSize - interactionDist);
    }

    draw(ctx) {
        super.draw(ctx);
    }
}