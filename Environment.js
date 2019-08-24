class Environment {
    constructor(size, diff, visc) {
        this.size = size;
        this.scale = worldSize/size;
        this.visc = visc;
        this.diff = diff;
        this.wall = new Array(size*size).fill(0);
        // this.iterations = 1;
        // this.density = new Array(size*size).fill(0);
        // this.s = new Array(size*size).fill(0);
        // this.vx = new Array(size*size).fill(0);
        // this.vy = new Array(size*size).fill(0);
        // this.vx0 = new Array(size*size).fill(0);
        // this.vy0 = new Array(size*size).fill(0);
        // this.velBounce = -1;
        // this.denBounce = 1;

        this.worker = new Worker('Worker.js');
    }

    sendMessage(cmd, args) {
        switch (cmd) {
            case "init":
                this.worker.postMessage([cmd, worldSize, viewSize, this.size, this.diff, this.visc]);
                break;
            case "update":
                this.worker.postMessage([cmd, args[0]]);
            case "worldToGrid":
                this.worker.postMessage([cmd, args[0], args[1]]);
                break;
            case "addDensity":
                this.worker.postMessage([cmd, args[0], args[1], args[2]]);
                break;
            case "addVelocity":
                this.worker.postMessage([cmd, args[0], args[1], args[2], args[3]]);
                break;
            case "addWall":
                this.worker.postMessage([cmd, args[0], args[1], args[2]]);
                break;
            case "draw":
                this.worker.postMessage([cmd]);
                break;
        }
    }

    worldToGrid(x,y) {
        this.sendMessage("worldToGrid", [x, y]);
    }

    addDensity(x, y, amount) {
        this.sendMessage("addDensity", [x, y, amount]);
    }

    addVelocity(x, y, amountX, amountY) {
        if (amountX instanceof(Vector)) {
            amountY = amountX.y;
            amountX = amountX.x;
        }
        this.sendMessage("addVelocity", [x, y, amountX, amountY]);
    }

    // Duplicate functionality, is there a better way? --- >
    addWall(x,y, type) {
        this.wall[this.worldToGrid(x,y)] = type;
        this.sendMessage("addWall", [x, y, type]);
    }

    ix(x,y) {
        return x + y * this.size;
    }

    worldToGrid(x,y) {
        x = (x / this.scale) | 0;
        y = (y / this.scale) | 0;
        return this.ix(x,y);
    }

    isWall(x,y) {
        return this.wall[this.worldToGrid(x,y)];
    }
    // < --- Duplicate functionality, is there a better way?




    draw(ctx) {
        // this.sendMessage("draw");
        // let x, y, r, g, b;
        // for (x = 0; x < this.size; x++) {
        //     for (y = 0; y < this.size; y++) {
        //         if (this.wall[this.ix(x,y)] === 1) {
        //             r = 128;
        //             g = 128;
        //             b = 128;
        //         } else if (this.wall[this.ix(x,y)] === 2) {
        //             r = 255;
        //             g = 255;
        //             b = 255;
        //         } else {
        //             r = 0;
        //             g = 0;
        //             b = 0;
        //         }
        //         if (r > 2 || g > 2 || b > 2) {
        //             ctx.fillStyle = "rgb("+ r + "," + g + "," + b +")";
        //             ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
        //         }
        //     }
        // }


        // let x, y, r, g, b, v, d;
        // for (x = 0; x < this.size; x++) {
        //     for (y = 0; y < this.size; y++) {
        //         if (this.wall[this.ix(x,y)] === 1) {
        //             r = 128;
        //             g = 128;
        //             b = 128;
        //         } else if (this.wall[this.ix(x,y)] === 2) {
        //             r = 255;
        //             g = 255;
        //             b = 255;
        //         } else {
        //             v = 100 * new Vector(this.vx[this.ix(x,y)], this.vy[this.ix(x,y)]).magnitude();
        //             d = 100 * this.density[this.ix(x,y)];
        //             r = v + d*3;
        //             g = v + d; 
        //             b = v * 1.25;
        //             r = Math.min(255, r);
        //             g = Math.min(255, g);
        //             b = Math.min(255, b);
        //         }
        //         if (r > 2 || g > 2 || b > 2) {
        //             ctx.fillStyle = "rgb("+ r + "," + g + "," + b +")";
        //             ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
        //         }
        //     }   
        // }
    }

    // getVector({x,y}) {
    //     x = (x / this.scale) | 0;
    //     y = (y / this.scale) | 0;
    //     let index = this.ix(x,y);
    //     return new Vector(this.vx[index], this.vy[index]);
    // }


    update(dt) {
        // this.sendMessage("update", [dt]);
        // this.vx0 = [...this.vx];
        // this.vy0 = [...this.vy];
        // this.s = [...this.density];
        // Got rid of diffusion for a significant performance boost 

        // this.project(this.vx0, this.vy0, this.vx, this.vy, this.velBounce);
        
        // this.advect(this.vx, this.vx0, this.vx0, this.vy0, dt, 0.9999, this.velBounce);    
        // this.advect(this.vy, this.vy0, this.vx0, this.vy0, dt, 0.9999, this.velBounce);
        
        // this.project(this.vx, this.vy, this.vx0, this.vy0, this.velBounce);
        // this.advect(this.density, this.s, this.vx, this.vy, dt, 0.965, this.denBounce);
    }
/*    
    project(veloX, veloY, p, div, bounce) {
        let j,i;
        let d1, d2, d3, d4, d5, d6;
        for (j = 1; j < this.size - 1; j++) {
            for (i = 1; i < this.size - 1; i++) {
                if (this.wall[this.ix(i,j)] == 0) {
                    d1 = this.addPos(veloX, i, j, 1, 0, bounce) + this.addPos(veloY, i, j, 0, 1, bounce);
                    d2 = -this.addPos(veloX, i, j,-1, 0, bounce)-this.addPos(veloY, i, j, 0, -1, bounce);
                    d3 = this.addPos(veloY, i, j, 0, 1, bounce)+this.addPos(veloX, i, j, 1, 0, bounce);
                    d4 = -this.addPos(veloY, i, j, 0, -1, bounce)-this.addPos(veloX, i, j, -1, 0, bounce);
                    // div[this.ix(i,j)] = -0.25 * (d1 + d2 + d3 + d4);
                    div[this.ix(i,j)] = -0.5 * (d1 + d2);
                    p[this.ix(i,j)] = div[this.ix(i,j)];
                }
            }
        }

        for (j = 1; j < this.size - 1; j++) {
            for (i = 1; i < this.size - 1; i++) {
                if (this.wall[this.ix(i,j)] == 0) {
                    d1 = this.addPos(p, i, j, 1, 0, bounce);
                    d2 = this.addPos(p, i, j, -1, 0, bounce);
                    d3 = this.addPos(p, i, j, 1, 1, bounce);
                    d4 = this.addPos(p, i, j, -1, -1, bounce);
                    d5 = this.addPos(p, i, j, 1, -1, bounce);
                    d6 = this.addPos(p, i, j, -1, 1, bounce);
                    // veloX[this.ix(i,j)] -= (d1 - d2 + (d3 - d4 + d5 - d6) * 0.4) * 0.4;
                    veloX[this.ix(i,j)] -= 0.5 * (d1 - d2);
                    d1 = this.addPos(p, i, j, 0, 1, bounce);
                    d2 = this.addPos(p, i, j, 0, -1, bounce);
                    d3 = this.addPos(p, i, j, 1, 1, bounce);
                    d4 = this.addPos(p, i, j, -1, -1, bounce);
                    d5 = this.addPos(p, i, j, 1, -1, bounce);
                    d6 = this.addPos(p, i, j, -1, 1, bounce);
                    // veloY[this.ix(i,j)] -= (d1 - d2 + (d3 - d4 + d5 - d6) * 0.4) * 0.4;
                    veloY[this.ix(i,j)] -= 0.5 * (d1 - d2);
                }
            }
        }
    }

    advect(d, d0, veloX, veloY, dt, loss, bounce) {
        let i0, i1, j0, j1;
        let dtx = dt * (this.size - 2);
    
        let s0, s1, t0, t1, x, y;
        let i,j;

        var d1,d2,d3,d4;
    
        for (j = 1; j < this.size - 1; j++) {
            for (i = 1; i < this.size - 1; i++) {
                if (this.wall[this.ix(i,j)] == 0) {
                    x = i - dtx * veloX[this.ix(i,j)];
                    y = j - dtx * veloY[this.ix(i,j)];
        
                    if (x < 0.5) x = 0.5;
                    if (x > this.size - 1.5) x = this.size - 1.5;
                    i0 = x | 0;
                    i1 = i0 + 1;
                    if (y < 0.5) y = 0.5;
                    if (y > this.size - 1.5) y = this.size - 1.5;
                    j0 = y | 0;
                    j1 = j0 + 1;
        
                    s1 = x - i0;
                    s0 = 1 - s1;
                    t1 = y - j0;
                    t0 = 1 - t1;

                    d1 = this.addPos(d0, i, j, i0 - i, j0 - j, bounce);
                    d2 = this.addPos(d0, i, j, i0 - i, j1 - j, bounce);
                    d3 = this.addPos(d0, i, j, i1 - i, j0 - j, bounce);
                    d4 = this.addPos(d0, i, j, i1 - i, j1 - j, bounce);
                    d[this.ix(i,j)] = 
                    loss * (s0 * 
                                (t0 * d1
                                 + t1 * d2)
                         +  s1 * 
                                (t0 * d3
                                 + t1 * d4));
                }
            }
        }
    }

    ix(x,y) {
        return x + y * this.size;
    }

    worldToGrid(x,y) {
        x = (x / this.scale) | 0;
        y = (y / this.scale) | 0;
        return this.ix(x,y);
    }

    addPos(arr, x, y, dx, dy, bounce) {
        // if (this.wall[this.ix(x+dx, y+dy)] !== 0) this.walls++; 
        var ret;
        if (this.wall[this.ix(x+dx, y+dy)] == 0)
            ret = arr[this.ix(x+dx,y+dy)]
        else {
            if (bounce < 0) {
                bounce *= this.density[this.ix(x,y)];
            } else {
                bounce *= new Vector(this.vx[this.ix(x,y)], this.vy[this.ix(x,y)]).magnitude();
            }
            ret = bounce*arr[this.ix(x,y)];
        }
        return ret;
    }

    addDensity(x, y, amount) {
        this.density[this.worldToGrid(x,y)] += amount;
    }

    addVelocity(x, y, amountX, amountY) {
        if (amountX instanceof(Vector)) {
            amountY = amountX.y;
            amountX = amountX.x;
        }
        let index = this.worldToGrid(x,y);
        this.vx[index] += amountX;
        this.vy[index] += amountY;
    }

    isWall(x,y) {
        return this.wall[this.worldToGrid(x,y)];
    }

    addWall(x,y, type) {
        this.wall[this.worldToGrid(x,y)] = type;
        this.density[this.worldToGrid(x,y)] = 0;
        this.s[this.worldToGrid(x,y)] = 0;
        this.vx[this.worldToGrid(x,y)] = 0;
        this.vy[this.worldToGrid(x,y)] = 0;
        this.vx0[this.worldToGrid(x,y)] = 0;
        this.vy0[this.worldToGrid(x,y)] = 0;
    }
    */
}

/*

class Environment {
    constructor(size, diff, visc) {
        this.size = size;
        this.scale = worldSize/size;
        this.visc = visc
        this.iterations = 1;
        this.diff = diff;
        this.density = new Array(size*size).fill(0.075);
        this.s = new Array(size*size).fill(0.075);
        this.vx = new Array(size*size).fill(0);
        this.vy = new Array(size*size).fill(0);
        this.vx0 = new Array(size*size).fill(0);
        this.vy0 = new Array(size*size).fill(0);
        console.log("start");
    }

    update(dt) {
        this.diffuse(1, this.vx0, this.vx, this.visc, dt);
        this.diffuse(2, this.vy0, this.vy, this.visc, dt);

        this.project(this.vx0, this.vy0, this.vx, this.vy);
        
        this.advect(1, this.vx, this.vx0, this.vx0, this.vy0, dt);    
        this.advect(2, this.vy, this.vy0, this.vx0, this.vy0, dt);
        
        this.project(this.vx, this.vy, this.vx0, this.vy0);
        this.diffuse(0, this.s, this.density, this.diff, dt);
        this.advect(0, this.density, this.s, this.vx, this.vy, dt);
    }

    draw(ctx) {
        this.drawH(ctx);
    }

    drawD(ctx) {
        let x, y, color;
        for (x = 0; x < this.size; x++) {
            for (y = 0; y < this.size; y++) {
                color = 1000 * this.density[this.ix(x,y)];
                ctx.fillStyle = "rgb("+ color + "," + color + "," + color +")";
                ctx.fillRect(x * this.scale,y * this.scale, this.scale, this.scale);
            }   
        }
    }

    drawH(ctx) {
        let x, y, color;
        for (x = 0; x < this.size; x++) {
            for (y = 0; y < this.size; y++) {
                color = 100 * new Vector(this.vx[this.ix(x,y)], this.vy[this.ix(x,y)]).magnitude();
                ctx.fillStyle = "rgb("+ color*5 + "," + color * 2 + "," + color +")";
                ctx.fillRect(x * this.scale,y * this.scale, this.scale, this.scale);
            }   
        }
    }

    drawAll(ctx) {
        let x, y, r, g, b;
        for (x = 0; x < this.size; x++) {
            for (y = 0; y < this.size; y++) {
                r = 2000 * Math.abs(this.vx[this.ix(x,y)]);
                g = 100 * this.density[this.ix(x,y)];
                b = 2000 * Math.abs(this.vy[this.ix(x,y)]);
                ctx.fillStyle = "rgb("+ r + "," + g + "," + b +")";
                ctx.fillRect(x * this.scale,y * this.scale, this.scale, this.scale);
            }   
        }
    }

    getVector({x,y}) {
        x = (x / this.scale) | 0;
        y = (y / this.scale) | 0;
        let index = this.ix(x,y);
        return new Vector(this.vx[index], this.vy[index]);
    }

    ix(x,y) {
        return x + y * this.size;
    }

    addDensity(x, y, amount) {
        x = (x / this.scale) | 0;
        y = (y / this.scale) | 0;
        let index = this.ix(x,y);
        this.density[index] += amount;
    }

    addVelocity(x, y, amountX, amountY) {
        if (amountX instanceof(Vector)) {
            amountY = amountX.y;
            amountX = amountX.x;
        }
        x = (x / this.scale) | 0;
        y = (y / this.scale) | 0;
        let index = this.ix(x,y);
        this.vx[index] += amountX;
        this.vy[index] += amountY;
    }

    diffuse(b, x, x0, diff, dt) {
        let a = dt * diff * (this.size - 2) * (this.size - 2);
        this.lin_solve(b, x, x0, a, 1 + 6 * a);
    }

    lin_solve(b, x, x0, a, c) {
        let cRecip = 1.0 / c;
        let k,j,i;
        for (k = 0; k < this.iterations; k++) {
            for (j = 1; j < this.size - 1; j++) {
                for (i = 1; i < this.size - 1; i++) {
                    x[this.ix(i,j)] = 
                        (x0[this.ix(i,j)]
                        + a * (x[this.ix(i+1,j)]
                             + x[this.ix(i-1,j)]
                             + x[this.ix(i,j+1)]
                             + x[this.ix(i,j-1)])
                        ) * cRecip;
                }
            }
        }
        this.set_bnd(b,x);
    }

    project(veloX, veloY, p, div) {
        let j,i;
        for (j = 1; j < this.size - 1; j++) {
            for (i = 1; i < this.size - 1; i++) {
                div[this.ix(i,j)] = -0.5 * (
                    veloX[this.ix(i+1, j)]
                    -veloX[this.ix(i-1, j)]
                    +veloY[this.ix(i, j+1)]
                    -veloY[this.ix(i, j-1)]
                ) / this.size;
                p[this.ix(i,j)] = 0;
            }
        }

        this.set_bnd(0, div);
        this.set_bnd(0, p);
        this.lin_solve(0,p,div, 1, 6);

        for (j = 1; j < this.size - 1; j++) {
            for (i = 1; i < this.size - 1; i++) {
                veloX[this.ix(i,j)] -= 0.5 * (p[this.ix(i+1, j)] - p[this.ix(i-1, j)]) * this.size;
                veloY[this.ix(i,j)] -= 0.5 * (p[this.ix(i, j+1)] - p[this.ix(i, j-1)]) * this.size;
            }
        }
        this.set_bnd(1, veloX);
        this.set_bnd(2, veloY);
    }

    advect(b, d, d0, veloX, veloY, dt) {
        let i0, i1, j0, j1;
        let dtx = dt * (this.size - 2);
        let dty = dt * (this.size - 2);

        let s0, s1, t0, t1;
        let tmp1, tmp2, x, y;

        let i,j;

        for (j = 1; j < this.size - 1; j++) {
            for (i = 1; i < this.size - 1; i++) {
                tmp1 = dtx * veloX[this.ix(i,j)];
                tmp2 = dty * veloY[this.ix(i,j)];
                x = i - tmp1;
                y = j - tmp2;

                if (x < 0.5) x = 0.5;
                if (x > this.size + 0.5) x = this.size + 0.5;
                i0 = x | 0;
                i1 = i0 + 1;
                if (y < 0.5) y = 0.5;
                if (y > this.size + 0.5) y = this.size + 0.5;
                j0 = y | 0;
                j1 = j0 + 1;

                s1 = x - i0;
                s0 = 1 - s1;
                t1 = y - j0;
                t0 = 1 - t1;

                d[this.ix(i,j)] = 
                      s0 * (t0 * d0[this.ix(i0 | 0, j0 | 0)] + t1 * d0[this.ix(i0 | 0, j1 | 0)])
                    + s1 * (t0 * d0[this.ix(i1 | 0, j0 | 0)] + t1 * d0[this.ix(i1 | 0, j1 | 0)]);
            }
        }
        this.set_bnd(b, d);
    }

    set_bnd(b, x) {
    //     for (let i = 1; i < this.size - 1; i++) {
    //         x[this.ix(i, 0            )] = b == 2 ? -x[this.ix(i, 1)] : x[this.ix(i,1)];
    //         x[this.ix(i, this.size - 1)] = b == 2 ? -x[this.ix(i, this.size - 2)] : x[this.ix(i,this.size - 2)];
    //     }

    //     for (let j = 1; j < this.size - 1; j++) {
    //         x[this.ix(0, j            )] = b == 1 ? -x[this.ix(1, j)] : x[this.ix(1,j)];
    //         x[this.ix(this.size - 1, j)] = b == 1 ? -x[this.ix(this.size - 2, j)] : x[this.ix(this.size - 2, j)];
    //     }

    //     x[this.ix(0,0)] = 0.5 * (x[this.ix(1,0)] + x[this.ix(0,1)]);
    //     x[this.ix(0,this.size - 1)] = 0.5 * (x[this.ix(1, this.size - 1)] + x[this.ix(0,this.size - 2)]);
    //     x[this.ix(this.size - 1, 0)] = 0.5 * (x[this.ix(this.size - 2, 0)] + x[this.ix(this.size - 1, 1)]);
    //     x[this.ix(this.size - 1, this.size - 1)] = 0.5 * (x[this.ix(this.size - 2, this.size - 1)] + x[this.ix(this.size - 1, this.size - 2)]);
    }
}

*/