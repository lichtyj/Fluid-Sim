class Resource extends Entity {
    constructor(position, type, color) {
        super(position, 16, color);
        this.type = type;
        this.worker = null
    }

    static create(position, type) {
        let obj = new Resource(position, type);
        game.addEntity(obj);
        return obj;
    }

    destroy() {
        Resource.create(getRandomVector(worldSize), this.type);
        game.remove(this);
    }
}