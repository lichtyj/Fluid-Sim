class Entity {
    constructor(position, width, height, color, mass) {
        this.position = position;
        this.velocity = Vector.zero();
        this.acceleration = Vector.zero();

        this.maxSpeed = 4;
        this.width = width;
        this.height = height;
        this.color = color;
        this.mass = mass;

        this.airRes = 0.9;
        this.groundRes = 0.4;

        this.gravity = Vector.zero();
    }

    onGround() {
        let ret = false;
        for (var x = 0; x < this.width; x++) {
            if (game.environment.isWall(this.position.x - this.width/2 + x, this.position.y+this.height/2)) {
                ret = true;
                break;
            }
        }
        return ret;
    }

    checkCollisions() {
        var sign = Math.sign(this.velocity.y);

        // Vertical
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; sign*y < sign*this.velocity.y; y += sign) {
                if (game.environment.isWall(this.position.x - this.width/2 + x, this.position.y+sign*this.height/2+y)) {
                    this.velocity.y = -this.velocity.y*this.groundRes;
                    this.position.y += y*sign;
                }
            }
        }

        sign = Math.sign(this.velocity.x);
        // Horizontal
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; sign*x < sign*this.velocity.x; x += sign) {
                if (game.environment.isWall(this.position.x + sign*this.width/2 + x, this.position.y-this.height/2+y)) {
                    this.velocity.x = -this.velocity.x*this.groundRes;
                    this.position.x += x*sign;
                }
            }
        }

    }

    update() {
        this.acceleration.add(this.gravity);
        if (Math.abs(this.velocity.x) > this.maxSpeed) this.velocity.x = Math.sign(this.velocity.x)*this.maxSpeed;
        // if (this.velocity.magnitude() < this.maxSpeed) {
            // Do this better
            // Create Add with limit function to vector class
        // }
        game.wind(this.position, this.velocity, this.width, this.height, this.mass);
        // this.velocity.add(game.environment.getVector(this.position).mult(1/(this.width*10)));
        // if (this.onGround()) {
        //     this.velocity.x *= this.groundRes;
        // } else {
            this.velocity.mult(0.9);
        // }

        this.acceleration.add(this.gravity);
        this.velocity.add(this.acceleration);
        this.checkCollisions();
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x - this.width/2, this.position.y - this.height/2, this.width, this.height);
    }

    destroy() {
        game.remove(this);
    }
}