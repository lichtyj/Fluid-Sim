var interactionDist = 4;

class Player extends Entity {
    constructor(position) {
        super(position, 8, "blue", 1);
        this.canJump = 1;
        this.fire = 0;
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
        if (this.canJump > 0) {
            this.acceleration.add(Vector.up().mult(4));
            this.canJump--;
        }
    }

    boom() {
        this.fire = 10;
        // this.acceleration.add(Vector.up().mult(1));
    }

    update() {
        super.update();
        if (this.outsideWorld()) {
            game.player = Player.create(new Vector(64,16));
            this.destroy();
        }

        if (this.onGround()) {
            this.canJump = 2;
        }

        if (this.fire > 0) {
            var v;
            this.fire--;
            for (var i = 0; i < 4; i++) {
                v = Vector.randomMinMax(1,4);
                v.y*=1.5;
                v.y-=2;
                game.environment.addVelocity(this.position.x + v.x, this.position.y + v.y, v.mult(10));
                v.mult(0.1);
                game.environment.addDensity(this.position.x + v.x, this.position.y + v.y, 8);
            }
            // v.y -= 4;
            v.x *= 2;
            Particle.create((this.position.clone()).add(v), v.mult(1), Math.random()*10 + 5);
        }
    }

    outsideWorld() {
        return (this.position.x < interactionDist || this.position.x > worldSize - interactionDist) || (this.position.y < interactionDist || this.position.y > worldSize - interactionDist);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        // if (this.velocity.magnitude() > 0.75) {
        // ctx.fillStyle = "white";
        var offset = Math.min(this.velocity.y, this.maxSpeed);
        // var offset = 0;
        ctx.fillRect(this.position.x - (this.width - offset)/2, this.position.y - (this.width + offset)/2, this.width - offset, this.width + offset);
    }
}