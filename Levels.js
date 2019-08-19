function LoadLevel01() {
    for (let i = 16; i < 96; i++) {
        game.environment.addWall(i,96);
        game.environment.addWall(i,97);
        if (i > 64) {
            game.environment.addWall(i,64);
            game.environment.addWall(i,65);
        }
        // Tree.create(getRandomVector(worldSize));
        // Person.create(getRandomVector(worldSize))
        // game.environment.addDensity(Math.random()*worldSize,Math.random()*worldSize, 1);
    }
    game.player = Player.create(new Vector(32,32));
}

function getRandom(size) {
    return Math.random() * size;
}

function getRandomVector(size) {
    return Vector.create(getRandom(size), getRandom(size))
}