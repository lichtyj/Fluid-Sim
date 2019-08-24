function LoadLevel01() {
    // 2 == solid
    // 1 == jump through
    this.drawLineX(16,54,16,2);
    this.drawLineX(16,112,96,2);
    this.drawLineX(16,160,224,1);
    this.drawLineX(16,240,224,2);
    this.drawLineX(96,32,16,2);
    this.drawLineX(96,64,16,1);
    this.drawLineX(96,80,16,1);
    this.drawLineX(96,96,16,1);

    this.drawLineY(16,80,32,2);
    this.drawLineY(112,80,32,2);

    Emitter.create(new Vector(46, 46), 255, 0  , 0  , 0.01 , 0    , -1, 0);
    Emitter.create(new Vector(46, 74), 0  , 255, 0  , 0    , -0.01, -1, 0);
    Emitter.create(new Vector(74, 74), 255, 255, 255, -0.01, 0    , -1, 0);
    Emitter.create(new Vector(74, 46), 0  , 0  , 255, 0    , 0.01 , -1, 0);

        // Tree.create(getRandomVector(worldSize));
        // Person.create(getRandomVector(worldSize))
        // game.environment.addDensity(Math.random()*worldSize,Math.random()*worldSize, 1);
    game.player = Player.create(new Vector(64,96));
}

function drawLineX(x, y, length, type) {
    for (var i = 0; i < length; i++) {
        game.environment.addWall(x + i,y, type);
    }
}

function drawLineY(x, y, length, type) {
    for (var i = 0; i < length; i++) {
        game.environment.addWall(x, y + i, type);
    }
}

function getRandom(size) {
    return Math.random() * size;
}

function getRandomVector(size) {
    return Vector.create(getRandom(size), getRandom(size))
}