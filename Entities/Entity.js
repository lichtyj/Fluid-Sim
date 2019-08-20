var interactionDist = 2;

class Entity {
    constructor(position, width, height, color, mass) {
        this.position = position;
        this.velocity = Vector.zero();
        this.acceleration = Vector.zero();

        this.maxSpeed = 1.5;
        this.width = width;
        this.height = height;
        this.color = color;
        this.mass = mass;

        this.airRes = 0.9;
        this.groundRes = 0.7;
        this.wallBounce = 0.2;
        this.isDropping = false;

        this.gravity = Vector.zero();
    }

    onGround() {
        let ret = false;
        for (var x = 1; x < this.width; x++) {
            if (this.velocity.y >= 0 && game.environment.isWall(this.position.x - this.width/2 + x, this.position.y+this.height/2)) {
                ret = true;
                break;
            }
        }
        return ret;
    }

    checkCollisions() {

        // Down
        for (var x = 1; x < this.width; x++) {
            for (var y = 0; y < this.velocity.y; y++) {
                if (game.environment.isWall(this.position.x - this.width/2 + x, this.position.y+this.height/2+y) > (this.isDropping)? 1 : 0) {
                    if (this.velocity.y > 2) {
                        game.wind(this.position, this.velocity.clone().mult(2), this.width*2, this.height, this.mass*3);
                    }
                    this.onImpact(this.position.clone(), this.velocity.clone());
                    this.position.y += y;
                    this.velocity.y = 0;
                    break;
                }
            }
        }

        // Up
        for (var x = 1; x < this.width; x++) {
            for (var y = 0; y > this.velocity.y; y--) {
                if (game.environment.isWall(this.position.x - this.width/2 + x - 1, this.position.y-this.height/2+y) === 2) {
                    this.onImpact(this.position.clone(), this.velocity.clone());
                    this.velocity.y = 0;
                    this.position.y -= y;
                    break;
                }
            }
        }

        // // Left
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x > this.velocity.x; x--) {
                if (game.environment.isWall(this.position.x - this.width/2 - x - 1, this.position.y-this.height/2+y) === 2) {
                    this.onImpact(this.position.clone(), this.velocity.clone());
                    this.velocity.x = 0;
                    this.position.x = (this.position.x - x) | 0;
                    break;
                }
            }
        }

        // Right
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.velocity.x; x++) {
                if (game.environment.isWall(this.position.x + this.width/2 + x, this.position.y-this.height/2+y) === 2) {
                    this.onImpact(this.position.clone(), this.velocity.clone());
                    this.velocity.x = 0;
                    this.position.x += x;
                    break;
                }
            }
        }

    }

    update() {

        // if (this.velocity.magnitude() < this.maxSpeed) {
            // Do this better
            // Create Add with limit function to vector class
        // }
        game.wind(this.position.clone(), this.velocity.clone(), this.width, this.height, this.mass);
        // this.velocity.add(game.environment.getVector(this.position).mult(1/(this.width*10)));
        // if (this.onGround()) {
        //     this.velocity.x *= this.groundRes;
        // } else {
            this.velocity.mult(this.airRes);
        // }

        this.acceleration.add(this.gravity);
        this.velocity.add(this.acceleration);
        this.checkCollisions();
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect((this.position.x - this.width/2) | 0, (this.position.y - this.height/2) | 0, (this.width) | 0, (this.height) | 0);
    }

    destroy() {
        game.remove(this);
    }

    outsideWorld() {
        return (this.position.x < interactionDist || this.position.x > worldSize - interactionDist) || (this.position.y < interactionDist || this.position.y > worldSize - interactionDist);
    }
}