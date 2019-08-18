var interactionDist = 16;

class Player extends Entity {
    constructor(position) {
        super(position, 8, "blue");
        this.temp = 0;
    }

    static create(position) {
        let obj = new Player(position);
        obj.gravity = Vector.down().mult(0.125);
        game.addEntity(obj);
        return obj;
    }

    move(direction) {
        if (this.onGround()) {
            this.acceleration.add(direction.mult(0.25));
        } else {
            this.acceleration.add(direction.mult(0.125));
        }
    }

    jump() {
        if (this.onGround()) this.acceleration.add(Vector.up().mult(4));
    }

    boom() {
        this.temp = 10;
    }

    update() {
        super.update();
        if (this.outsideWorld()) {
            this.destroy();
        }

        if (this.temp > 0) {
            var v;
            this.temp--;
            // for (var i = 0; i < 32; i++) {
                v = Vector.randomMinMax(0,0);
                v.x *= 4;
                if (v.y > 0) v.y *= -1;
                game.environment.addVelocity(this.position.x + v.x, this.position.y + v.y, v);
                game.environment.addDensity(this.position.x + v.x, this.position.y + v.y + 10, -10);
                Particle.create(this.position.add(v), v.mult(0.025), Math.random()*5 + 5);
            // }
        }

    }

    outsideWorld() {
        return (this.position.x < interactionDist || this.position.x > worldSize - interactionDist) || (this.position.y < interactionDist || this.position.y > worldSize - interactionDist);
    }

    draw(ctx) {
        super.draw(ctx);
    }
}