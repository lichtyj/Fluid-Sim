function LoadLevel01() {
    this.drawLine(16,54,32,54);
    this.drawLine(16,112,112,112);
    this.drawLine(96,80,96,112);
    this.drawLine(96,80,112,80);
    this.drawLine(96,32,112,32);
        // Tree.create(getRandomVector(worldSize));
        // Person.create(getRandomVector(worldSize))
        // game.environment.addDensity(Math.random()*worldSize,Math.random()*worldSize, 1);
    game.player = Player.create(new Vector(64,96));
}

function drawLine(sx, sy, ex, ey) {
    if (sx === ex) {
        for (var y = sy; y < ey; y++) {
            game.environment.addWall(sx,y);
        }
    } else {
        var m = (ey - sy)/(ex - sx);
        var length = new Vector(ex-sx, ey-sy).magnitude();
        for (var i = 0; i < length; i++) {
            game.environment.addWall(sx+(Math.cos(m)*i)|0,sy+(Math.sin(m)*i)|0);
        }
    }
}

function getRandom(size) {
    return Math.random() * size;
}

function getRandomVector(size) {
    return Vector.create(getRandom(size), getRandom(size))
}