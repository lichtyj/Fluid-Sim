class Explosion extends Entity {
    constructor(position, force) {
        super(position, 1, "red");
        this.force = force;
    }

    static create(position, velocity, force) {
        let obj = new Explosion(position, force);
        obj.velocity = velocity;
        game.addEntity(obj);
        return obj;
    }

    update() {
        super.update();
        if (this.force <= 0) {
            game.remove(this);
        }
        if (this.force > 1) {
            this.force -= 1;
            this.explode();
        }
    }

    explode() {
        var v;
        for (var i = 0; i < 8; i++) {
            v = Vector.randomMinMax(1,this.force);
            v.subtract(this.velocity);
            v.mult(0.25);
            // v.y*=1.5;
            game.environment.addVelocity(this.position.x + v.x, this.position.y + v.y, v);
            game.environment.addVelocity(this.position.x + v.x, this.position.y + v.y, v);
            game.environment.addVelocity(this.position.x + v.x, this.position.y + v.y, v);
            game.environment.addVelocity(this.position.x + v.x, this.position.y + v.y, v);
            game.environment.addDensity(this.position.x + v.x, this.position.y + v.y, this.force*200, this.force*100, this.force*50);
        }
        Particle.create((this.position.clone()).add(v), v, Math.random()*this.force + this.force*5);
    }
}