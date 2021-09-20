// True means don't calculate values
var flag = true;
export class Adder {
    constructor(r, update_pos_cb) {
        this.ro = r;
        this.cr = 0;

        this.update_pos = () => {
            update_pos_cb(this);
            this.cr = this.ro * Math.min(windowWidth / 1920, windowHeight / 1080);
        }

        this.update_pos();
    }

    clicked() {
        return false;
    }

    draw() {
        const x = this.cx;
        const y = this.cy;
        const r = this.cr;

        circle(x, y, 2 * r);

        // Draw the adder cross line
        line(x - r, y, x + r, y);
        line(x, y - r, x, y + r);
    }
}