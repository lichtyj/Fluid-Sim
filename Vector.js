class Vector { // Ignores z in all non-elementary calcs
    constructor(x, y) {
        if (arguments.length == 0) {
            this.x = 0;
            this.y = 0;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    scale(scalar) {
        var temp = this.magnitude();
        this.x *= scalar;
        this.y *= scalar;
        this.limit(temp*scalar);
        return this;
    }

    limit(max) {
        max *= max;
        var mag = this.magnitudeSqrd();
        if (mag > max) this.div(mag/max);
        return this;
    }

    average(vector, amount) {
        if (amount == undefined) amount = 1;
        this.mult(amount);
        this.add(vector);
        this.div(amount + 1);
    }

    angle() {
        var a = Math.atan(this.y/this.x);
        if (this.x < 0) a += Math.PI;
        if (this.x == 0) a = Math.PI*Math.sign(this.y);
        return a;
    }
    
    angleTo(vector) {
        if (vector instanceof Vector) {
            var a = Math.atan((vector.y - this.y)/(vector.x - this.x));
            if (vector.x < this.x) a += Math.PI;
            return a;
        }
    }

    toAngle(angle) {
        var mag = this.magnitude();
        if (mag < 1) mag = 1;
        this.x = Math.cos(angle);
        this.y = Math.sin(angle);
        this.mult(mag);
        return this;
    }
    
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magnitudeSqrd() {
        return this.x * this.x + this.y * this.y;
    }

    equals(other) {
        if (!(other instanceof Vector)) return false;
        return (this.x == other && this.y == other.y);
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }

    offset(angle, offset) {
        return new Vector(this.x + Math.cos(offset.angle() + angle.angle()) * offset.magnitude(), 
                          this.y + Math.sin(offset.angle() + angle.angle()) * offset.magnitude());
    }

    static random(max) {
        if (max == undefined) max = 1;
        var v = new Vector((Math.random()*2-1)*max, (Math.random()*2-1)*max, 0);
        return v.limit(max);
    }

    static randomMinMax(min, max) {
        var dir = Math.random() * Math.PI * 2;
        var rand = min + ((max - min) * Math.random());
        var v = new Vector(rand * Math.sin(dir), rand * Math.cos(dir));
        return v;
    }

    static randomPositive(max, bounded) {
        if (max == undefined) max = 1;
        if (bounded == undefined) bounded = true;
        var v = new Vector(Math.random()*max, Math.random()*max, 0);
        if (bounded) v.limit(max);
        return v;
    }

    static distance(me, other) {
        return Math.sqrt(Math.pow(me.x - other.x, 2) + Math.pow(me.y - other.y, 2));
    }

    static distanceSqrd(me, other) {
        return Math.pow(me.x - other.x, 2) + Math.pow(me.y - other.y, 2);
    }

    static towardPoint(from, to) {
        return new Vector(to.x - from.x, to.y - from.y);
    }

    //TODO return an encapsulated version of these.  Single instance - no GC    
    static zero() {
        return new Vector(0, 0);
    }

    static left() {
        return new Vector(-1, 0);
    }

    static right() {
        return new Vector(1, 0);
    }

    static up() {
        return new Vector(0, -1);
    }

    static down() {
        return new Vector(0, 1);
    }

    static fromAngle(angle, magnitude) {
        if (magnitude === undefined) magnitude = 1;
        return (new Vector(Math.cos(angle), Math.sin(angle))).mult(magnitude);
    }

    static create(x,y) {
        return new Vector(x, y);
    }
}