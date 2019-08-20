class Person extends Entity {
    constructor(position) {
        super(position, 1, "red");
        this.health = 100;
        this.job = null;
        this.heading
    }

    static create(position) {
        let obj = new Person(position);
        game.addEntity(obj);
        return obj;
    }

    update() {
        super.update();
        if (this.health <= 0) {
            game.remove(this);
        }
        // this.health -= 0.01;
        // this.health -= this.velocity.magnitude()/10.0;
        this.color = "rgb(" + this.health*2.55 + ",0,0)";

        this.heading = Vector.towardPoint(this.position, getRandomVector(worldSize)).limit(this.maxSpeed);
        // this.heading = Vector.towardPoint(this.position, new Vector(256,256)).limit(this.maxSpeed);

        if (this.outsideWorld()) {
            this.destroy();
            Person.create(getRandomVector(worldSize));
        }


        // this.findWork();
        this.acceleration = this.heading;
    }

    outsideWorld() {
        return (this.position.x < interactionDist || this.position.x > worldSize - interactionDist) || (this.position.y < interactionDist || this.position.y > worldSize - interactionDist);
    }

    findWork() {
        if (this.health < 75) {
            var nearest = this.findNearestResource();
            if (nearest != undefined) {
                if (this.job === null) {
                    this.job = Job.create(nearest.type, 100, () => {this.health += 50; nearest.destroy(); this.job = null}); /// Look up table to work types
                } else if (Vector.distanceSqrd(this.position, nearest.position) < interactionDist) {
                    this.job.doWork(1); // Use skills for amount
                }        
            }
            this.heading = Vector.towardPoint(this.position, nearest.position).limit(this.maxSpeed);
        } else {
            this.heading = Vector.random(0.125);
        }
    }

    findNearestResource(type) {
        let nearestDist = worldSize * worldSize;
        let temp;
        let nearest = null;
        game.entities.forEach((entity) => {
            if (entity.constructor.name === "Resource" && entity.worker === null && (type === undefined || entity.type === type)) {
                temp = Vector.distanceSqrd(this.position, entity.position);
                if (temp < nearestDist) {
                    nearestDist = temp;
                    nearest = entity;
                }
            }
        });
        return nearest;
    }

    draw(ctx) {
        super.draw(ctx);
        if (this.job !== null) {
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.position.x - this.width/2, this.position.y + this.width/2 + 2, (this.job.progress / this.job.work) * this.width, 4);
        }
    }
}