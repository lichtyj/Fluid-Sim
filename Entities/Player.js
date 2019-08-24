class Player extends Entity {
    constructor(position) {
        super(position, 4, 8, "blue", 1);
        this.canJump = 1;
        this.maxJumps = 2;
        this.maxCoyoteTime = 8;
        this.fire = 0;
        this.coyoteTime = 0;

        this.moving = false;
        this.jumping = false;
        this.onFire = false;

        this.red = 100;
        this.green = 50;
        this.blue = 10;
    }

    static create(position) {
        let obj = new Player(position);
        obj.gravity = Vector.down().mult(0.25);
        game.addEntity(obj);
        return obj;
    }

    move(direction) {
        if (this.onGround()) {
            this.acceleration.add(direction.mult(0.25));    
        } else {
            this.acceleration.add(direction.mult(0.25));
        }
        this.moving = true;
    }

    stop(direction) {
        if (Math.sign(direction.x) === Math.sign(this.velocity.x)) this.velocity.x /= 4;
        this.moving = false;
    }

    jump() {
        if (this.canJump > 0) {
            this.acceleration.add(Vector.up().mult(5));
            if (this.canJump < this.maxJumps) this.boom();
            this.canJump--;
            this.jumping = true;
        }
    }

    stopJump() {
        if (this.velocity.y < 0) this.velocity.y /= 2;
        this.jumping = false;
    }

    boom() {
        this.fire = 6;
        // this.acceleration.add(Vector.up().mult(1));
    }

    shoot(target) {
        if (target.x < 0) target.x = 0;
        if (target.x > worldSize - 1) target.x = worldSize - 1;
        if (target.y < 0) target.y = 0;
        if (target.y > worldSize - 1) target.y = worldSize - 1;
        var angle = this.position.angleTo(target);
        var dir = Vector.fromAngle(angle, 5);
        var vx = dir.x*0.25;
        var vy = dir.y*0.25;
        game.environment.addDensityArea(this.position.x + dir.x, this.position.y + dir.y - 4, 255, 100, 25, 2);
        game.environment.addVelocityArea(this.position.x + dir.x * 0.5, this.position.y + dir.y * 0.5 - 4, vx, vy, 2);
        Projectile.create(this.position.clone().add(new Vector(0, -4)), dir);
    }

    onImpact() {
        
    }

    update() {
        if (Math.abs(this.velocity.x) > this.maxSpeed) this.velocity.x = Math.sign(this.velocity.x)*this.maxSpeed;
        super.update();
        if (this.outsideWorld()) {
            setTimeout(() => {game.player = Player.create(new Vector(64,16))}, 500);
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

        this.red += Math.random()*4 - 2;
        this.green += Math.random()*4 - 2;
        this.blue += Math.random()*4 - 2;
        this.red = this.red % 255;
        this.green = this.green % 255;
        this.blue = this.blue % 255;

        if (this.onFire) this.fire += 1;
        if (this.fire > 1) {
            var v;
            this.fire /= 2;
            for (var i = 0; i < 8; i++) {
                v = Vector.randomMinMax(1,4);
                v.subtract(this.velocity);
                // v.y*=1.5;
                if (this.onFire) v.y-=1;
                v.mult(this.fire/10);
                game.environment.addVelocity(this.position.x + v.x    , this.position.y + this.height/2 + v.y - 4    , v);
                // game.environment.addVelocity(this.position.x + v.x + 1, this.position.y + this.height/2 + v.y    , v);
                // game.environment.addVelocity(this.position.x + v.x - 1, this.position.y + this.height/2 + v.y    , v);
                // game.environment.addVelocity(this.position.x + v.x    , this.position.y + this.height/2 + v.y + 1, v);
                // game.environment.addVelocity(this.position.x + v.x    , this.position.y + this.height/2 + v.y - 1, v);
                game.environment.addVelocity(this.position.x + v.x + 2, this.position.y + this.height/2 + v.y - 4    , v);
                game.environment.addVelocity(this.position.x + v.x - 2, this.position.y + this.height/2 + v.y - 4    , v);
                game.environment.addVelocity(this.position.x + v.x    , this.position.y + this.height/2 + v.y - 4 + 2, v);
                game.environment.addVelocity(this.position.x + v.x    , this.position.y + this.height/2 + v.y - 4 - 2, v);
                
                game.environment.addDensity(this.position.x + v.x, this.position.y + this.height/2 + v.y - 4, this.onFire*this.red, this.onFire*this.green, this.onFire*this.blue);
            }
            // // v.x *= 2;
            // v.mult(5);
            // v.y -= Math.random()*2+2;
            // v.x *= Math.random()*2+1;
            // Particle.create((this.position.clone()).add(v), v, Math.random()*5+12);
        }
    }

    outsideWorld() {
        return (this.position.x < interactionDist || this.position.x > worldSize - interactionDist) || (this.position.y < interactionDist || this.position.y > worldSize - interactionDist);
    }

    draw(ctx) {
        ctx.fillStyle = (this.isDropping) ? "green" : (this.coyoteTime > 0) ? "red" : this.color;
        // if (this.velocity.magnitude() > 0.75) {
        // ctx.fillStyle = "white";
        var offset = Math.min(this.velocity.y, this.maxSpeed);
        // var offset = 0;
        ctx.fillRect((this.position.x - (this.width - offset)/2) | 0, (this.position.y - (this.height/2 + offset)) | 0, (this.width - offset) | 0, (this.height + offset) | 0);
    }
}