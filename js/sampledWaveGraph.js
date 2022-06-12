let sampledWaveCanvas = document.getElementById('sampledWaveCanvas');
let sampledWaveCtx = sampledWaveCanvas.getContext('2d');

let canvas_width = sampledWaveCanvas.parentElement.clientWidth || 1100;
let canvas_height = 250;
let orgx = 50;
let orgy = canvas_height / 2;

sampledWaveCanvas.width = canvas_width;
sampledWaveCanvas.height = canvas_height;

const wave_amplitude_element = document.getElementById("swamplitude");
const wave_frequency_element = document.getElementById("swfrequency");
const sample_frequency_element = document.getElementById("safrequency");
const vertical_scale_element = document.getElementById("sampledwave_vertical_scale_factor");
const horizontal_scale_element = document.getElementById("sampledwave_horizontal_scale_factor");

// Draws the axes for the graph
function drawAxes(ctx, orgx, orgy, line_start, line_end) {
    ctx.beginPath();
    // Vertical line
    ctx.strokeStyle = "black";
    ctx.moveTo(orgx, line_start);
    ctx.lineTo(orgx, line_end);
    ctx.stroke();

    // Horizontal line
    ctx.strokeStyle = "black";
    ctx.moveTo(orgx, line_end);
    ctx.lineTo(canvas_width - 50, line_end);
    ctx.stroke();

    // Base line
    ctx.strokeStyle = "black";
    ctx.moveTo(orgx, (line_start + line_end) / 2);
    ctx.lineTo(canvas_width - 50, (line_start + line_end) / 2);
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

function drawPoint(ctx, x, y) {
    var radius = 3.0;
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.lineWidth = 1;
    ctx.arc(x, y, radius*1.3, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.closePath();
}

// Will draw the sine wave starting from loc xOffset, yOffset
function plotLollipop(ctx, amplitude, frequency, xOffset, yOffset, vertical_scaling_factor, horizontal_scaling_factor,mid_of_line) {
    var width = 1000;
    // Gets the wave's amplitude, frequency and sampling freq value.
    // var Fs = frequency * 25;
    var Fs = sample_frequency_element.value;

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

    var idx = 0;
    while (idx < width) {
        drawPoint(ctx, xOffset + idx * horizontal_scaling_factor, yOffset - vertical_scaling_factor * x[idx]);

        ctx.moveTo(xOffset + idx * horizontal_scaling_factor, yOffset - vertical_scaling_factor * x[idx])
        ctx.lineTo(xOffset + idx * horizontal_scaling_factor, mid_of_line)
        ctx.stroke();
        idx++;
    }
    ctx.stroke();
    ctx.save();

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Amplitude: ${amplitude}v`, canvas_width - 200, 50, 110);
    ctx.fillText(`Frequency: ${frequency}Hz`, canvas_width - 200, 80, 110);
    ctx.fillText(`Sampling Frequency: ${Fs}Hz`, canvas_width - 270, 110, 180);
    ctx.closePath();
}

let size_set = false;

export function drawSampledWave() {
    const wave_amplitude = wave_amplitude_element.value*2;
    const wave_frequency = wave_frequency_element.value;
    const vertical_scaling_factor = vertical_scale_element.value;
    const horizontal_scaling_factor = horizontal_scale_element.value;

    canvas_height = sampledWaveCanvas.parentElement.clientHeight;
    canvas_width = sampledWaveCanvas.parentElement.clientWidth;
    if (canvas_height > 100 && !size_set) {
        canvas_height = sampledWaveCanvas.parentElement.clientHeight;
        canvas_width = sampledWaveCanvas.parentElement.clientWidth;
        sampledWaveCtx.canvas.width = canvas_width;
        sampledWaveCtx.canvas.height = canvas_height;
        size_set = true;
    }

    // Clear the screen
    sampledWaveCtx.fillStyle = "white";
    sampledWaveCtx.fillRect(0, 0, canvas_width, canvas_height);

    // Vertical line start and end
    const line_start = 20;
    const line_end = canvas_height - 50;
    var mid_of_line = (line_start + line_end) / 2;

    drawAxes(sampledWaveCtx, orgx, orgy, line_start, line_end);
    plotLollipop(sampledWaveCtx, wave_amplitude, wave_frequency, orgx, mid_of_line, vertical_scaling_factor, horizontal_scaling_factor,mid_of_line=mid_of_line);
    requestAnimationFrame(drawSampledWave);
}