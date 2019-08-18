class Tree extends Resource {
    constructor(position) {
        super(position, "Tree", "green");
    }

    static create(position) {
        let obj = new Tree(position);
        game.addEntity(obj);
        return obj;
    }
}