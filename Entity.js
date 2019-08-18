class Entity {
    constructor(position, width, color, mass) {
        this.position = position;
        this.velocity = Vector.zero();
        this.acceleration = Vector.zero();

        this.maxSpeed = 4;
        this.width = width;
        this.color = color;
        this.mass = mass;

        this.airRes = 0.9;
        this.groundRes = 0.4;

        this.gravity = Vector.zero();
    }

    onGround() {
        return game.environment.isWall(this.position.x, this.position.y+this.width/2)
    }

    update() {
        this.acceleration.add(this.gravity);
        this.velocity.add(this.acceleration);
        if (Math.abs(this.velocity.x) > this.maxSpeed) this.velocity.x = Math.sin(this.velocity.x)*this.maxSpeed;
        // this.velocity.limit(this.maxSpeed);
        // game.wind(this.position, this.velocity, this.width);
        this.velocity.add(game.environment.getVector(this.position).mult(1/this.width));
        for (var y = 0; y < this.velocity.y; y++) {
            if (game.environment.isWall(this.position.x, this.position.y+this.width/2+y)) {
                this.velocity.y = 0;
                this.position.y += y;
            }
        }
        // if (this.onGround()) {
        //     this.velocity.x *= this.groundRes;
        // } else {
            this.velocity.mult(0.9);
        // }

        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        // if (this.velocity.magnitude() > 0.75) {
        // ctx.fillStyle = "white";
        var offset = Math.min(this.velocity.y, this.maxSpeed);
        ctx.fillRect(this.position.x - (this.width - offset)/2, this.position.y - (this.width + offset)/2, this.width - offset, this.width + offset);
        // }
    }

    destroy() {
        game.remove(this);
    }
}