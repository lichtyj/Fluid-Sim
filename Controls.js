class Controls {
    constructor() {
        this.keys = [];
        this.idleKeys = [];
        this.lmb = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseLastX = 0;
        this.mouseLastY = 0;
        this.doc;
    }

    init() {
        var that = this;
        this.doc =  document.getElementById("viewport");
        this.doc.addEventListener("keydown", function(e) {
            that.keyDown(e.keyCode)});
        this.doc.addEventListener("keyup", function(e) {
            that.keyUp(e.keyCode)});
        // this.doc.addEventListener("focus", function() {
        //     that.focus()});
        // this.doc.addEventListener("blur", function() {
        //     that.blur()});
        this.doc.addEventListener("mouseup", function(e) {
            that.mouseButton(e, false) });
        this.doc.addEventListener("mousedown", function(e) {
            that.mouseButton(e, true) });
        this.doc.addEventListener("mousemove", function(e) {
            that.mouseMove(e) });
        // this.doc.addEventListener("wheel", function(e) {
        //     that.mouseWheel(Math.sign(e.deltaY)) });
    }

    // focus() {
    //     game.resume();
    //     document.getElementById("body").style="overflow: hidden;"
    // }

    // blur() {
    //     game.pause();
    //     document.getElementById("body").style="overflow: auto;"
    // }

    keyUp(num) {
        if (this.keys.indexOf(num) != -1) delete this.keys.splice(this.keys.indexOf(num),1);
        if (this.idleKeys.indexOf(num) != -1) delete this.idleKeys.splice(this.idleKeys.indexOf(num),1);
    }

    keyIdle(num) {
        if (this.idleKeys.indexOf(num) == -1) {
            this.idleKeys.push(num);
        }
    }

    keyDown(num) {
        if (this.keys.indexOf(num) == -1 && this.idleKeys.indexOf(num) == -1) {
            console.log(num);
            this.keys.push(num);
        }
    }

    mouseButton(e, pressed) {
        if (pressed) {
            // this.mouseX = (game.view.x + (game.view.width + e.layerX - 800)/2) | 0;
            // this.mouseY = (game.view.y + (game.view.height + e.layerY - 800)/2) | 0;
            if (this.keys.indexOf("lmb") == -1) this.keys.push("lmb");
        } else {
            this.keyUp("lmb");
        }
    }

    mouseMove(e) {
        this.mouseLastX = this.mouseX;
        this.mouseLastY = this.mouseY;
        this.mouseX = (2*game.view.x + e.layerX) | 0;
        this.mouseY = (2*game.view.y + e.layerY) | 0;
    }

    mouseWheel(y) {
        // terrain.zoomIn(y*.05);
    }

    pausedActions() {
        if (game.paused) {            
            for (var key of this.keys) {
                switch(key) {
                    case 32: // space
                        game.update(game.step);
                        game.draw(game.step);
                        game.ui.draw();
                        this.keyUp(key);
                        break;
                    case 80: // P
                        game.resume();
                        this.keyUp(key);
                        break;
                }
            }
        }
    }

    actions() {
        var moving = Vector.zero();
        for (var key of this.keys) {
            switch(key) {
                case 65: case 37: // A
                    moving.add(Vector.left());
                    break;
                case 68: case 39: // D
                    moving.add(Vector.right());
                    break;
                case 69: // E
                    game.player.boom();
                    this.keyUp(key);
                    break;
                case 71: // G
                    terrain.generateObjects(25);
                    this.keyUp(key);
                    break;
                case 72: // H
                    terrain.generateFood(25);
                    this.keyUp(key);
                    break;
                case 80: // P
                    game.pause();
                    this.keyUp(key);
                    break;
                case 81: // Q
                    game.addWall(this.mouseX, this.mouseY);
                    break;
                case 82: // R
                    // game.selectRandomNpc();
                    this.keyUp(key);
                    break;
                case 83: // S
                    moving.add(Vector.down());
                    break;
                case 87: case 38: // W
                    game.player.jump();
                    this.keyUp(key);
                    this.keyIdle(key);
                    break;
                case 118: // F7
                    // game.save();
                    this.keyUp(key);
                    break;
                case 120: // F9
                    // game.load();
                    this.keyUp(key);
                    break;
                case "lmb":
                    // game.shoot(this.mouseX, this.mouseY, this.mouseX - this.mouseLastX, this.mouseY - this.mouseLastY);
                    // this.keyUp(key);
                    console.log(this.mouseX + ", " + this.mouseY);
                    break;
            }
        }

        if (moving.magnitudeSqrd() != 0) {
            game.player.move(moving);
        }
    }
}