class GameEngine {
    constructor(ctx, uiCtx) {
        this.entities = [];
        this.ctx = ctx;
        this.lastFrame = 0;
        this.dt = 0;
        this.step = 1/60;
        this.toRemove = [];
        this.ui = new GUI(uiCtx);
        this.time = 0;
        this.view = {x: 0, y:0, width: worldSize, height: worldSize};

        this.environment;
        this.interval = 40;

        this.shot = {x: 0, y: 0, z: 0};

        this.player;
    }

    init() {
        this.ui.pushMessage("BUILDING WORLD...", "#FFF");
        window.setTimeout(this.gameLoop, 10);
        this.environment = new Environment(128, 0.00000000000001, 0.00000000001);
        LoadLevel01();
    }

    start() {
        this.ui.pushMessage("<P> TO BEGIN", "#FFF");
        game.ui.draw();
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
        game.ui.draw();
        window.requestAnimationFrame(game.gameLoop);
    }

    wind(pos, vel, size, mass) {
        if (size > 4) size -= 2;
        for (var i = -size/2; i < size/2; i++) {
            for (var j = -size/2; j < size/2; j++) {
                this.environment.addVelocity(pos.x+i,pos.y+j, vel.x/8*mass, vel.y/8*mass);
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
            this.entities.splice(this.entities.indexOf(rem),1);
        }
    }

    draw() {
        this.ctx.canvas.width = this.ctx.canvas.width;
        this.environment.draw(this.ctx);
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