class Emitter extends Entity {
    constructor(position, r, g, b, vx, vy, life) {
        super(position, 0, "black");
        this.r = r;
        this.g = g;
        this.b = b;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
    }

    static create(position, r,g,b, vx, vy, life, gravity) {
        let obj = new Emitter(position, r, g, b, vx, vy, life);
        if (gravity != undefined) this.gravity = gravity;
        game.addEntity(obj);
        return obj;
    }

    update() {
        super.update();
        if (this.life == 0) {
            game.remove(this);
        } else if (this.life > 0) {
            this.life--;
        }
        if (this.r > 0 || this.g > 0 || this.b > 0) 
            game.environment.addDensity(this.position.x, this.position.y, this.r, this.g, this.b);
        if (this.vx != 0 || this.vy != 0)
            game.environment.addVelocity(this.position.x, this.position.y, this.vx, this.vy);
    }
}