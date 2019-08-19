var interactionDist = 4;

class Player extends Entity {
    constructor(position) {
        super(position, 8, 16, "blue", 1);
        this.canJump = 1;
        this.maxJumps = 2;
        this.maxCoyoteTime = 8;
        this.fire = 0;
        this.coyoteTime = 0;
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
            this.acceleration.add(Vector.up().mult(5));
            if (this.canJump < this.maxJumps) this.boom();
            this.canJump--;
        }
    }

    boom() {
        this.fire = 6;
        // this.acceleration.add(Vector.up().mult(1));
    }

    update() {
        super.update();
        if (this.outsideWorld()) {
            game.player = Player.create(new Vector(64,16));
            this.destroy();
        }

        if (this.onGround()) {
            this.canJump = this.maxJumps;
            this.coyoteTime = this.maxCoyoteTime;
        } else if (this.coyoteTime > 0) {
                this.coyoteTime--;
                this.acceleration.subtract(this.gravity.clone().mult(0.8));
        } else if (this.coyoteTime == 0 && this.canJump == this.maxJumps) {
            this.canJump--;
            this.coyoteTime = -1;
        }

        if (this.fire > 0) {
            var v;
            this.fire--;
            for (var i = 0; i < 4; i++) {
                v = Vector.randomMinMax(1,4);
                v.y*=1.5;
                v.y-=4+this.velocity.y;
                game.environment.addVelocity(this.position.x + v.x, this.position.y + this.height/2 + v.y, v.mult(15));
                v.mult(0.05);
                game.environment.addDensity(this.position.x + v.x, this.position.y + this.height/2 + v.y, 16);
            }
            // v.y -= 4;
            // v.x *= 2;
            Particle.create((this.position.clone()).add(v), v, Math.random()*10);
        }
    }

    outsideWorld() {
        return (this.position.x < interactionDist || this.position.x > worldSize - interactionDist) || (this.position.y < interactionDist || this.position.y > worldSize - interactionDist);
    }

    draw(ctx) {
        ctx.fillStyle = (this.coyoteTime > 0) ? "red" : this.color;
        // if (this.velocity.magnitude() > 0.75) {
        // ctx.fillStyle = "white";
        var offset = Math.min(this.velocity.y, this.maxSpeed);
        // var offset = 0;
        ctx.fillRect(this.position.x - (this.width - offset)/2, this.position.y - (this.height/2 + offset), this.width - offset, this.height + offset);
    }
}