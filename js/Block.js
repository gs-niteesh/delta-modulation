class Block {
    constructor(x, y, w, h, name, onclick) {
        this.name = name;
        this.xo = x;
        this.yo = y;
        this.wo = w;
        this.ho = h;

        this.cx = x;
        this.cy = y;
        this.cw = w;
        this.ch = h;

        this.onclick = onclick
        this.update_pos();
    }

    update_pos() {
        const width = windowWidth;
        const height = windowHeight;

        this.cx = this.xo * (width / 1920);
        this.cy = this.yo * (height / 876);
        this.cw = this.wo * (width / 1920);
        this.ch = this.ho * (height / 876);
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

        const font_size = 25 * Math.min(windowWidth / 1920, windowHeight / 876);

        fill(10);
        rect(cx, cy, cw, ch, 20);
        textSize(font_size);
        textStyle('bold');
        textAlign(CENTER, CENTER);
        fill(255);
        text(this.name, cx + cw / 2, cy + ch / 2);
    }

    singleClick() {

    }

    doubleClick() {

    }
}

export class Sampler extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'SAMPLER');
    }
}
export class OneBitQuantizer extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, '1-BIT\nQUANTIZER');
    }
}
export class PredictionFilter extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'PREDICTION\nFILTER');
    }
}
export class Encoder extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'ENCODER');
    }
}