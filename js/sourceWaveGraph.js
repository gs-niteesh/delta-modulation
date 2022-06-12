let sourceWaveCanvas = document.getElementById('sourceWaveCanvas');
let sourceWaveCtx = sourceWaveCanvas.getContext('2d');

let canvas_width = sourceWaveCanvas.parentElement.clientWidth || 1100;
let canvas_height = 250;
let orgx = 50;
let orgy = canvas_height / 2;

sourceWaveCanvas.width = canvas_width;
sourceWaveCanvas.height = canvas_height;

const wave_amplitude_element = document.getElementById("swamplitude");
const wave_frequency_element = document.getElementById("swfrequency");
const vertical_scale_element = document.getElementById("sourcewave_vertical_scale_factor");
const horizontal_scale_element = document.getElementById("sourcewave_horizontal_scale_factor");

// Draws the axes for the graph
function drawAxes(ctx, orgx, orgy, line_start, line_end) {
    ctx.beginPath();
    // Vertical line
    ctx.moveTo(orgx, line_start);
    ctx.lineTo(orgx, line_end);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Horizontal line
    ctx.moveTo(orgx, line_end);
    ctx.lineTo(canvas_width - 50, line_end);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Base line
    ctx.moveTo(orgx, (line_start + line_end) / 2);
    ctx.lineTo(canvas_width - 50, (line_start + line_end) / 2);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Y-Axis:Amplitude(Volts)", orgx + 10, line_start + 10, 190);
    ctx.fillText("X-Axis:Timeperiod(ms)", canvas_width - 200, line_end + 20, 170);
    ctx.closePath();
}

/*
 * Returns an array of values starting with value *start* ending
 * at value *stop* and with an increment of *step*.
 * xrange(1, 3, 0.5) will return [1, 1.5, 2, 2.5, 3]
 */
function xrange(start, stop, step) {
    var res = [];
    var i = start;
    while (i <= stop) {
        res.push(i);
        i += step;
    }
    return res;
}

// Will draw the sine wave starting from loc xOffset, yOffset
function plotSine(ctx, amplitude, frequency, xOffset, yOffset, vertical_scaling_factor, horizontal_scaling_factor) {
    var width = 1000;

    // 1-5: 80
    // 6-12: 140
    // 13-20: 200
    var Fs = 0;
    if (frequency >= 1 && frequency <= 5) Fs = 80;
    else if (frequency >= 6 && frequency <= 12) Fs = 140;
    else Fs = 250;

    // Generates the values for the sine wave.
    var StopTime = 1;
    var dt = 1 / Fs;
    var t = xrange(0, StopTime + dt, dt);
    var x = [];
    t.forEach((val) => {
        x.push(amplitude * Math.sin(2 * Math.PI * frequency * val));
    });


    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";

    // Draw the original sine wave.
    var idx = 0;
    while (idx < width && idx < x.length) {
        ctx.lineTo(xOffset + idx * horizontal_scaling_factor, yOffset - vertical_scaling_factor * x[idx]);
        idx++;
    }

    // while (x.length < width) {
    //     x = x.concat(x);
    // }

    // while (idx < width && idx < x.length) {
    //     ctx.lineTo(xOffset + idx * horizontal_scaling_factor, yOffset - vertical_scaling_factor * x[idx]);
    //     idx++;
    // }

    ctx.stroke();
    ctx.save();
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Amplitude: ${amplitude}v`, canvas_width - 200, 50, 110);
    ctx.fillText(`Frequency: ${frequency}Hz`, canvas_width - 200, 80, 110);
    ctx.closePath();
}

let size_set = false;

export function drawSourceWave() {
    const wave_amplitude = wave_amplitude_element.value*2;
    const wave_frequency = wave_frequency_element.value;
    const vertical_scaling_factor = vertical_scale_element.value;
    const horizontal_scaling_factor = horizontal_scale_element.value;

    canvas_height = sourceWaveCanvas.parentElement.clientHeight;
    canvas_width = sourceWaveCanvas.parentElement.clientWidth;
    if (canvas_height > 100 && !size_set) {
        canvas_height = sourceWaveCanvas.parentElement.clientHeight;
        canvas_width = sourceWaveCanvas.parentElement.clientWidth;
        sourceWaveCtx.canvas.width = canvas_width;
        sourceWaveCtx.canvas.height = canvas_height;
        size_set = true;
    }

    // Clear the screen
    sourceWaveCtx.fillStyle = "white";
    sourceWaveCtx.fillRect(0, 0, canvas_width, canvas_height);

    // Vertical line start and end
    const line_start = 20;
    const line_end = canvas_height - 50;
    const mid_of_line = (line_start + line_end) / 2;

    drawAxes(sourceWaveCtx, orgx, orgy, line_start, line_end);
    plotSine(sourceWaveCtx, wave_amplitude, wave_frequency, orgx, mid_of_line, vertical_scaling_factor, horizontal_scaling_factor);
    requestAnimationFrame(drawSourceWave);
}