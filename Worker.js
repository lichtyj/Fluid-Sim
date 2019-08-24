var size;
var viewSize
var scale;
var visc;
var iterations = 1;
var diff = diff;
var velBounce = -1;
var denBounce = 1;

var density;
var s;
var vx;
var vy;
var vx0;
var vy0;
var wall;
var osctx;

function initWorker(_worldSize, _viewSize, _size, _diff, _visc) {
    size = _size;
    scale = _worldSize/_size;
    visc = _visc;
    diff = _diff;
    viewSize = _viewSize;
    density = new Array(size*size);
    s = new Array(size*size);
    for (var i = 0; i < size*size; i++) {
        density[i] = {r:0, g:0, b:0};
        s[i] = {r:0, g:0, b:0};
    }
    vx = new Array(size*size).fill(0);
    vy = new Array(size*size).fill(0);
    vx0 = new Array(size*size).fill(0);
    vy0 = new Array(size*size).fill(0);
    wall = new Array(size*size).fill(0);
    
    var dt = 0;
    var lastFrame = 0;
    var step = 1/60;
    var current;

    render = function(time) {
        current = performance.now();
        dt += Math.min(0.02, (current - lastFrame) / 1000);   // duration capped at 20ms
        while(dt > step) {
            dt -= step;
            update(step);
            draw();
        }
        lastFrame = current;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

onmessage = function(e) {
    // console.log(e.data[0]);
    if (e.data.canvas != undefined) {
        var canvas = e.data.canvas;
        canvas.width = viewSize;
        canvas.height = viewSize;
        osctx = canvas.getContext('2d', {alpha: false});
        osctx.imageSmoothingEnabled = false;
        console.log("got Here");
    }
    switch (e.data[0]) {
        case "init": 
            initWorker(e.data[1], e.data[2], e.data[3], e.data[4], e.data[5]);
            break;
        case "update":
            updateWorker(e.data[1]);
            break;
        case "worldToGrid":
            worldToGrid(e.data[1], e.data[2]);
            break;
        case "addDensity":
            addDensity(e.data[1], e.data[2], e.data[3], e.data[4], e.data[5]);
            break;
        case "addVelocity":
            addVelocity(e.data[1], e.data[2], e.data[3], e.data[4]);
            break;
        case "addWall":
            addWall(e.data[1], e.data[2], e.data[3]);
            break;
        case "draw": 
            draw();
            break;
        case "print":
            break;
    }
}

draw = function() {
    let i, j, x, y, r, g, b, v, d;
    var width = osctx.canvas.width;
    var height = osctx.canvas.height;
    // osctx.globalCompositeOperation = 'source-over';
    // osctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    osctx.fillStyle = 'rgba(0, 0, 0, 1)';
    osctx.fillRect(0, 0, width, height);
    var image = osctx.getImageData(0, 0, width, height);
    var data = image.data;
    for (x = 0; x < size; x++) {
        for (y = 0; y < size; y++) {
            r = 0;
            if (wall[ix(x,y)] === 1) {
                r = 128;
                g = 128;
                b = 128;
            } else if (wall[ix(x,y)] === 2) {
                r = 255;
                g = 255;
                b = 255;
            } else {
                v = 100 * Math.sqrt(Math.pow(vx[ix(x,y)], 2) + Math.pow(vy[ix(x,y)], 2));
                // d = 50 * density[ix(x,y)];
                // r = v + d*3;
                // g = v + d; 
                // b = v * 1.25;
                r = v + density[ix(x,y)].r;
                g = v + density[ix(x,y)].g;
                b = v + density[ix(x,y)].b;
                r = Math.min(255, r);
                g = Math.min(255, g);
                b = Math.min(255, b);
            }
            if (r > 2 || g > 2 || b > 2) {
                for(i = 0; i < 2; i++) {
                    for(j = 0; j < 2; j++) {
                        data[ix(x*2 + i, y*4 + j*2)*4] += r;
                        data[ix(x*2 + i, y*4 + j*2)*4+1] += g;
                        data[ix(x*2 + i, y*4 + j*2)*4+2] += b;
                    }
                }
            }
        }   
    }
    osctx.putImageData(image, 0, 0);
}

update = function(dt) {
    diffuse(vx0, vx, visc, dt);
    diffuse(vy0, vy, visc, dt);
    diffuseRGB(s, density, diff, dt);

    project(vx0, vy0, vx, vy, velBounce);
        
    advect(vx, vx0, vx0, vy0, dt, 0.9999, velBounce);    
    advect(vy, vy0, vx0, vy0, dt, 0.9999, velBounce);

    project(vx, vy, vx0, vy0, velBounce);
    advectRGB(density, s, vx, vy, dt, 0.965, denBounce);
}

ix = function(x,y) {
    return x + y * size;
}

diffuse = function (x, x0, diff, dt) {
    let a = dt * diff * (size - 2) * (size - 2);
    let cRecip = 1.0 / (1+6*a);
    let k,j,i;
    for (k = 0; k < 16; k++) {
        for (j = 1; j < size - 1; j++) {
            for (i = 1; i < size - 1; i++) {
                x[ix(i,j)] = 
                    (x0[ix(i,j)]
                    + a * (x[ix(i+1,j)]
                         + x[ix(i-1,j)]
                         + x[ix(i,j+1)]
                         + x[ix(i,j-1)])
                    ) * cRecip;
            }
        }
    }
}

diffuseRGB = function (x, x0, diff, dt) {
    let a = dt * diff * (size - 2) * (size - 2);
    let cRecip = 1.0 / (1+6*a);
    let k,j,i;
    for (k = 0; k < 4; k++) {
        for (j = 1; j < size - 1; j++) {
            for (i = 1; i < size - 1; i++) {
                x[ix(i,j)].r = 
                    ((x0[ix(i,j)].r
                    + a * (x[ix(i+1,j)].r
                         + x[ix(i-1,j)].r
                         + x[ix(i,j+1)].r
                         + x[ix(i,j-1)].r)
                    ) * cRecip);
                x[ix(i,j)].g = 
                    ((x0[ix(i,j)].g
                    + a * (x[ix(i+1,j)].g
                         + x[ix(i-1,j)].g
                         + x[ix(i,j+1)].g
                         + x[ix(i,j-1)].g)
                    ) * cRecip);
                x[ix(i,j)].b = 
                    ((x0[ix(i,j)].b
                    + a * (x[ix(i+1,j)].b
                         + x[ix(i-1,j)].b
                         + x[ix(i,j+1)].b
                         + x[ix(i,j-1)].b)
                    ) * cRecip);
            }
        }
    }
}

project = function(veloX, veloY, p, div, bounce) {
    let j,i;
    let d1, d2;
    for (j = 1; j < size - 1; j++) {
        for (i = 1; i < size - 1; i++) {
            if (wall[ix(i,j)] == 0) {
                d1 = addPos(veloX, i, j, 1, 0, bounce) + addPos(veloY, i, j, 0, 1, bounce);
                d2 = -addPos(veloX, i, j,-1, 0, bounce)-addPos(veloY, i, j, 0, -1, bounce);
                div[ix(i,j)] = -0.4 * (d1 + d2);
                p[ix(i,j)] = div[ix(i,j)];
            }
        }
    }

    for (j = 1; j < size - 1; j++) {
        for (i = 1; i < size - 1; i++) {
            if (wall[ix(i,j)] == 0) {
                d1 = addPos(p, i, j, 1, 0, bounce);
                d2 = addPos(p, i, j, -1, 0, bounce);
                veloX[ix(i,j)] -= 0.5 * (d1 - d2);
                d1 = addPos(p, i, j, 0, 1, bounce);
                d2 = addPos(p, i, j, 0, -1, bounce);
                veloY[ix(i,j)] -= 0.5 * (d1 - d2);
            }
        }
    }
}

advectRGB = function (d, d0, veloX, veloY, dt, loss, bounce) {
    let i0, i1, j0, j1;
    let dtx = dt * (size - 2);

    let s0, s1, t0, t1, x, y;
    let i,j;

    var d1,d2,d3,d4;

    for (j = 1; j < size - 1; j++) {
        for (i = 1; i < size - 1; i++) {
            if (wall[ix(i,j)] == 0) {
                x = i - dtx * veloX[ix(i,j)];
                y = j - dtx * veloY[ix(i,j)];
    
                if (x < 0.5) x = 0.5;
                if (x > size - 1.5) x = size - 1.5;
                i0 = x | 0;
                i1 = i0 + 1;
                if (y < 0.5) y = 0.5;
                if (y > size - 1.5) y = size - 1.5;
                j0 = y | 0;
                j1 = j0 + 1;
    
                s1 = x - i0;
                s0 = 1 - s1;
                t1 = y - j0;
                t0 = 1 - t1;

                d1 = addPosRGB(d0, i, j, i0 - i, j0 - j, bounce);
                d2 = addPosRGB(d0, i, j, i0 - i, j1 - j, bounce);
                d3 = addPosRGB(d0, i, j, i1 - i, j0 - j, bounce);
                d4 = addPosRGB(d0, i, j, i1 - i, j1 - j, bounce);
                d[ix(i,j)].r = loss * (s0 * (t0 * d1.r + t1 * d2.r) +  s1 * (t0 * d3.r + t1 * d4.r));
                d[ix(i,j)].g = loss * (s0 * (t0 * d1.g + t1 * d2.g) +  s1 * (t0 * d3.g + t1 * d4.g));
                d[ix(i,j)].b = loss * (s0 * (t0 * d1.b + t1 * d2.b) +  s1 * (t0 * d3.b + t1 * d4.b));
            }
        }
    }
}

advect = function (d, d0, veloX, veloY, dt, loss, bounce) {
    let i0, i1, j0, j1;
    let dtx = dt * (size - 2);

    let s0, s1, t0, t1, x, y;
    let i,j;

    var d1,d2,d3,d4;

    for (j = 1; j < size - 1; j++) {
        for (i = 1; i < size - 1; i++) {
            if (wall[ix(i,j)] == 0) {
                x = i - dtx * veloX[ix(i,j)];
                y = j - dtx * veloY[ix(i,j)];
    
                if (x < 0.5) x = 0.5;
                if (x > size - 1.5) x = size - 1.5;
                i0 = x | 0;
                i1 = i0 + 1;
                if (y < 0.5) y = 0.5;
                if (y > size - 1.5) y = size - 1.5;
                j0 = y | 0;
                j1 = j0 + 1;
    
                s1 = x - i0;
                s0 = 1 - s1;
                t1 = y - j0;
                t0 = 1 - t1;

                d1 = addPos(d0, i, j, i0 - i, j0 - j, bounce);
                d2 = addPos(d0, i, j, i0 - i, j1 - j, bounce);
                d3 = addPos(d0, i, j, i1 - i, j0 - j, bounce);
                d4 = addPos(d0, i, j, i1 - i, j1 - j, bounce);
                d[ix(i,j)] = 
                loss * (s0 * 
                            (t0 * d1 + t1 * d2)
                     +  s1 * 
                            (t0 * d3 + t1 * d4));
            }
        }
    }
}

worldToGrid = function(x,y) {
    x = (x / scale) | 0;
    y = (y / scale) | 0;
    return ix(x,y);
}

addDensity = function (x, y, r, g, b) {
    if (r === undefined) r = 0;
    if (g === undefined) g = 0;
    if (b === undefined) b = 0;

    density[worldToGrid(x,y)].r += r;
    density[worldToGrid(x,y)].g += g;
    density[worldToGrid(x,y)].b += b;
}

addVelocity = function (x, y, amountX, amountY) {
    let index = worldToGrid(x,y);
    vx[index] += amountX;
    vy[index] += amountY;
}

addWall = function (x,y, type) {
    wall[worldToGrid(x,y)] = type;
    density[worldToGrid(x,y)] = {r:0, g:0, b:0};
    s[worldToGrid(x,y)] = {r:0, g:0, b:0};
    vx[worldToGrid(x,y)] = 0;
    vy[worldToGrid(x,y)] = 0;
    vx0[worldToGrid(x,y)] = 0;
    vy0[worldToGrid(x,y)] = 0;
}

addPos = function(arr, x, y, dx, dy, bounce) {
    var ret;
    if (wall[ix(x+dx, y+dy)] == 0)
        ret = arr[ix(x+dx,y+dy)]
    else {
        // if (bounce < 0) {
        //     bounce *= density[ix(x,y)];
        // } else {
        //     bounce *= new Vector(vx[ix(x,y)], vy[ix(x,y)]).magnitude();
        // }
        ret = bounce*arr[ix(x,y)];
    }
    return ret;
}

addPosRGB = function(arr, x, y, dx, dy, bounce) {
    var ret;
    if (wall[ix(x+dx, y+dy)] == 0)
        ret = arr[ix(x+dx,y+dy)];
    else {
        // if (bounce < 0) {
        //     bounce *= density[ix(x,y)];
        // } else {
        //     bounce *= new Vector(vx[ix(x,y)], vy[ix(x,y)]).magnitude();
        // }
        ret = {r:arr[ix(x,y)].r * bounce, g:arr[ix(x,y)].g * bounce, b:arr[ix(x,y)].b * bounce};
    }
    return ret;
}