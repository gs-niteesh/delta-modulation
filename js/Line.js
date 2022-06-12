export class Line {
    constructor(update_pos, arrow_head = null, text = null) {
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.arrow_head = arrow_head;
        this.text = text;
        this.cb = update_pos;

        this.update_pos = () => {
            this.cb(this);
        }
        this.update_pos();
    }

    mouseOver() {
        return false;
    }

    draw() {
        const x1 = this.x1;
        const x2 = this.x2;
        const y1 = this.y1;
        const y2 = this.y2;
        const arrow_head = this.arrow_head;

        line(x1, y1, x2, y2);
        const arrow_length = 10 * Math.min(canvas.width / 1920, canvas.height / 1080);

        strokeWeight(2);
        if (arrow_head == 0) {
            line(x2, y2, x2 - arrow_length, y2 + arrow_length);
            line(x2, y2, x2 - arrow_length, y2 - arrow_length);
        } else if (arrow_head == 90) {
            line(x2, y2, x2 - arrow_length, y2 + arrow_length);
            line(x2, y2, x2 + arrow_length, y2 + arrow_length);
        } else if (arrow_head == 180) {
            line(x2, y2, x2 + arrow_length, y2 + arrow_length);
            line(x2, y2, x2 + arrow_length, y2 - arrow_length);
        } else if (arrow_head == 270) {
            line(x2, y2, x2 - arrow_length, y2 - arrow_length);
            line(x2, y2, x2 + arrow_length, y2 - arrow_length);
        }

        if (this.text) {
            textSize(12.5 * Math.min(canvas.width / 1920, canvas.height / 1080));
            textAlign(CENTER, BOTTOM);
            textStyle('bold');
            fill("#311b92");
            text(this.text, x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2 - 5);
        }
    }
}