class GameEngine {
    constructor(ctx) {
        this.entities = [];
        this.ctx = ctx;
        this.lastFrame = 0;
        this.dt = 0;
        this.step = 1/60;
        this.toRemove = [];
        this.time = 0;
        this.view = {x: 0, y:0, width: worldSize, height: worldSize};

        this.environment;
        this.interval = 40;

        this.shot = {x: 0, y: 0, z: 0};

        this.player;
    }

    init() {
        window.setTimeout(this.gameLoop, 1000);
        // this.environment = new Environment(128, 0.00000000000001, 0.00000000001);
        // this.environment = new Environment(128, 0.00001, 0.00001);
        // this.environment = new Environment(128, 0, 0);
        this.environment = new Environment(128, 0, 0);
        var canvas = document.getElementById("fluidcanvas");
        canvas.width = viewSize;
        canvas.height = viewSize;
        var offscreen = canvas.transferControlToOffscreen();
        this.environment.sendMessage("init");
        this.environment.worker.postMessage({canvas: offscreen}, [offscreen]);
        LoadLevel01();
    }

    addWall(x,y) {
        this.environment.addWall(x,y);
        this.environment.addWall(x,y+1);
        this.environment.addWall(x+1,y);
        this.environment.addWall(x+1,y+1);
    }

    gameLoop() { 
        game.time++;
        var current = performance.now();
        game.dt += Math.min(0.02, (current - game.lastFrame) / 1000);   // duration capped at 20ms
        while(game.dt > game.step) {
            game.dt -= game.step;
            game.update(game.step);
            game.draw();
        }
        game.lastFrame = current;
        window.requestAnimationFrame(game.gameLoop);
    }

    wind(pos, vel, width, height, mass) {
        if (width > 4) width -= 2;
        if (height > 4) height -= 2;
        width -= width/2;
        height -= height/2;
        for (var i = -width; i < width; i++) {
            for (var j = -height; j < height; j++) {
                this.environment.addVelocity(pos.x+i,pos.y+j, vel.x/32*mass, vel.y/32*mass);
            }
        }
    }

    update(dt) {
        controls.actions();
        this.environment.update(dt);
        for (var i = this.entities.length-1; i >= 0; i--) {
            this.entities[i].update(dt);    
        }
        while (this.toRemove.length > 0) {
            var rem = this.toRemove.pop();
            if (this.entities.indexOf(rem) !== -1) this.entities.splice(this.entities.indexOf(rem),1);
        }
    }

    draw() {

        this.environment.draw();

        this.ctx.canvas.width = this.ctx.canvas.width;
        // this.environment.draw(this.ctx);
        // // this.ctx.drawImage(this.offscreen,0,0);
        this.entities.sort((a,b) => {return (a.constructor.name < b.constructor.name) ? 1: -1})
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    remove(entity) {
        this.toRemove.push(entity);
    }
}