let encodedWaveCanvas = document.getElementById('encodedWaveCanvas');
let encodedWaveCtx = encodedWaveCanvas.getContext('2d');

let canvas_width = encodedWaveCanvas.parentElement.clientWidth || 1100;
let canvas_height = 250;
let orgx = 50;
let orgy = canvas_height / 2;

encodedWaveCanvas.width = canvas_width;
encodedWaveCanvas.height = canvas_height;

const wave_amplitude_element = document.getElementById("swamplitude");
const wave_frequency_element = document.getElementById("swfrequency");
const sampling_frequency_element = document.getElementById("safrequency")
const vertical_scale_element = document.getElementById("encodedwave_vertical_scale_factor");
const horizontal_scale_element = document.getElementById("encodedwave_horizontal_scale_factor");

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

function plotStairCase(ctx, arr, xOffset, yOffset, vertical_scaling_factor, horizontal_scaling_factor) {
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.stroke();
    // Scale the values in the array for plotting
    // Eg: if arr = [1, 1, 2] and scaling factor is 10
    // then arr = [10, 10, 20]
    arr.forEach((_, idx) => {
        arr[idx] *= vertical_scaling_factor;
    });

    // Learn about moveTo from the docs
    ctx.moveTo(arr[0] + 100, yOffset);

    // The below code is bit hard to explain through comments try going throught them
    // if you don't understand then i'll try explaining it.
    ctx.lineWidth = 1;

    var px = xOffset;
    var py = arr[0];

    for (var i = 1; i < arr.length; i++) {
        var xoff = i * horizontal_scaling_factor;
        ctx.lineTo(xoff + xOffset, yOffset - py);
        ctx.lineTo(xoff + xOffset, yOffset - arr[i]);
        px = xoff;
        py = arr[i];
    }

    ctx.stroke();
    ctx.closePath();
}


function plotDM(ctx, t, x, wave_amplitude, xOffset, yOffset, vertical_scaling_factor, horizontal_scaling_factor) {
    var width = 1000;
    // Gets the wave's amplitude, frequency and sampling freq value.
    var amplitude = wave_amplitude;
    var frequency = wave_frequency_element.value;
    var Fs = sampling_frequency_element.value;

    const delta = ((2 * Math.PI * amplitude * frequency) / Fs).toFixed(4);
    // Generates the values for the sine wave.
    var e = new Array(x.length);
    var eq = new Array(x.length);
    var xq = new Array(x.length);

    for (var i = 0; i < x.length; i++) {
        if (i == 0) {
            e[i] = x[i];
            eq[i] = delta * Math.sign(e[i]);
            xq[i] = parseFloat(eq[i].toFixed(2));
        } else {
            e[i] = x[i] - xq[i - 1]
            eq[i] = delta * Math.sign(e[i]);
            xq[i] = (eq[i] + xq[i - 1]);
        }
    }

    plotStairCase(ctx, xq, xOffset, yOffset, vertical_scaling_factor, horizontal_scaling_factor);
}

// Will draw the sine wave starting from loc xOffset, yOffset
function plotSine(ctx, amplitude, frequency, xOffset, yOffset, vertical_scaling_factor, horizontal_scaling_factor) {
    var width = 1000;
    // Gets the wave's amplitude, frequency and sampling freq value.
    var Fs = document.getElementById('safrequency').value;

    // Generates the values for the sine wave.
    var StopTime = 1;
    var dt = 1 / Fs;
    var t = xrange(0, StopTime + dt, dt);
    var x = [];
    t.forEach((val) => {
        x.push(amplitude * Math.sin(2 * Math.PI * frequency * val));
    });

    plotDM(ctx, t, x, amplitude, xOffset, yOffset, vertical_scaling_factor, horizontal_scaling_factor);
}

let size_set = false;

export function drawEncodedWave() {
    const wave_amplitude = wave_amplitude_element.value;
    const wave_frequency = wave_frequency_element.value;
    const vertical_scaling_factor = vertical_scale_element.value;
    const horizontal_scaling_factor = horizontal_scale_element.value;

    canvas_height = encodedWaveCanvas.parentElement.clientHeight;
    canvas_width = encodedWaveCanvas.parentElement.clientWidth;
    if (canvas_height > 100 && !size_set) {
        canvas_height = encodedWaveCanvas.parentElement.clientHeight;
        canvas_width = encodedWaveCanvas.parentElement.clientWidth;
        encodedWaveCtx.canvas.width = canvas_width;
        encodedWaveCtx.canvas.height = canvas_height;
        size_set = true;
    }

    // Clear the screen
    encodedWaveCtx.fillStyle = "white";
    encodedWaveCtx.fillRect(0, 0, canvas_width, canvas_height);

    // Vertical line start and end
    const line_start = 20;
    const line_end = canvas_height - 50;
    const mid_of_line = (line_start + line_end) / 2;

    drawAxes(encodedWaveCtx, orgx, orgy, line_start, line_end);
    plotSine(encodedWaveCtx, wave_amplitude, wave_frequency, orgx, mid_of_line, vertical_scaling_factor, horizontal_scaling_factor);
    requestAnimationFrame(drawEncodedWave);
}