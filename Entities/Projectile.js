class Projectile extends Entity {
    constructor(position, mass) {
        super(position, 1, 1, "red", mass);
    }

    static create(position, velocity) {
        let obj = new Projectile(position, 1);
        obj.velocity = velocity;
        obj.airRes = 1;
        game.addEntity(obj);
        return obj;
    }

    onImpact(position, velocity) {
        Explosion.create(position, velocity.mult(-1), 3);
        this.destroy();
    }

    update() {
        super.update();

        if (this.outsideWorld()) {
            this.destroy();
        }
    }

    draw(ctx) {
        super.draw(ctx);
    }
}