export class Block {
    constructor(x, y, w, h, name, onclick = null) {
        this.name = name;
        this.xo = x;
        this.yo = y;
        this.wo = w;
        this.ho = h;

        this.cx = 0;
        this.cy = 0;
        this.cw = w;
        this.ch = h;

        this.onclick = onclick
        this.update_pos();
    }

    update_pos() {
        const width = windowWidth;
        const height = windowHeight;

        this.cx = this.xo * width;
        this.cy = this.yo * height;
        this.cw = this.wo * (canvas.width / 1920);
        this.ch = this.ho * (canvas.height / 876);
    }

    clicked(x, y) {
        return x >= this.cx && x <= this.cx + this.cw &&
               y >= this.cy && y <= this.cy + this.ch;
    }

    draw() {
        const cx = this.cx;
        const cy = this.cy;
        const cw = this.cw;
        const ch = this.ch;

        const font_size = 25 * Math.min(canvas.width / 1920, canvas.height / 876);

        rect(cx, cy, cw, ch, 20);
        textSize(font_size);
        textAlign(CENTER, CENTER);
        text(this.name, cx + cw / 2, cy + ch / 2);
    }
}