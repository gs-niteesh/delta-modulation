import {connectionNodes } from './Block.js';

function circle_dist(x1, y1, x2, y2) {
    const xd = x2 - x1;
    const yd = y2 - y1;
    return xd * xd + yd * yd;
}


export class Point {
    constructor(x, y, r, name) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.r = r;
        this.selected = false;
    }

    didClick() {
        const rdist = circle_dist(this.x, this.y, mouseX, mouseY)
        return rdist < (this.r * this.r);
    }

    draw(){
        push();
        strokeWeight(4);
        stroke(255, 0, 0);
        if (this.selected || this.didClick()) {
            fill(255, 255, 0);
        } else {
            fill(255, 255, 255);
        }
        circle(this.x, this.y, this.r);
        pop();

    }

    update_pos(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Adder1 {
    constructor(x, y, r) {
        this.cx = x;
        this.cy = y;
        this.cr = r;
        this.one = new Point(this.cx - r - 7, this.cy, 15, 'a11');
        this.two = new Point(this.cx + r + 7, this.cy, 15, 'a12');
        this.three = new Point(this.cx, this.cy + this.cr + 7, 15, 'a13');
        this.four = new Point(this.cx, this.cy + this.cr + 120, 15, 'a14');
        connectionNodes.push(this.one);
        connectionNodes.push(this.two);
        connectionNodes.push(this.three);
        connectionNodes.push(this.four);
    }

    mouseOver() {
        return false;
    }

    draw() {
        const x = this.cx;
        const y = this.cy;
        const r = this.cr;

        push();
        fill("white");
        circle(x, y, 2 * r);
        // Draw the adder cross line
        line(x - r, y, x + r, y);
        line(x, y - r, x, y + r);
        pop();

        this.one.draw();
        this.two.draw();
        this.three.draw();
        this.four.draw();
    }

    update_pos() {}
}

export class Adder2 {
    constructor(x, y, r) {
        this.xo = x;
        this.yo = y;
        this.cx = x;
        this.cy = y;
        this.cr = r;
        this.one = new Point(this.cx - r - 7, this.cy, 15, 'a21');
        this.two = new Point(this.cx, this.cy - this.cr - 7, 15, 'a22');
        this.three = new Point(this.cx, this.cy + this.cr + 7, 15, 'a23');
        this.four = new Point(this.cx, this.cy - this.cr - 70, 15, 'a24');
        connectionNodes.push(this.one);
        connectionNodes.push(this.two);
        connectionNodes.push(this.three);
        connectionNodes.push(this.four);
    }

    update_pos() {
    }

    mouseOver() {
        return false;
    }

    draw() {
        const x = this.cx;
        const y = this.cy;
        const r = this.cr;

        push();
        fill("white");
        circle(x, y, 2 * r);
        // Draw the adder cross line
        line(x - r, y, x + r, y);
        line(x, y - r, x, y + r);
        pop()

        this.one.draw();
        this.two.draw();
        this.three.draw();
        this.four.draw();
    }
}