import { SineGenerator, Sampler, Quantizer, ReconstructionFilter, PredictionFilter, LowPassFilter, Evaluate } from './Block.js'
import { Wire, connectionNodes, WireManager, Encoder, Decoder } from './Block.js';
import { drawSourceWave } from './sourceWaveGraph.js';
import { drawSampledWave } from './sampledWaveGraph.js';
import { drawEncodedWave } from './encodedWaveGraph.js';
import { Line } from './Line.js';
import { Adder1, Adder2 } from './Adder.js';
import { drawDecoderWave } from './decoderWaveGraph.js';
import { drawReconWave } from "./reconWaveGraph.js";
import { drawQuantizedWave } from "./quantizerWaveGraph.js";
import { drawLPFWave } from './lpfWaveGraph.js';
//import { drawEvalWave } from './evalWaveGraph.js';
import { drawEvaluateWave } from './evaluateWaveGraph.js';

let myblocks = new Map();
let currentModal = null;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    myblocks.forEach((block) => {
        block.update_pos();
    });
}

const validConnections = [
    'sgo+sai',
    'sai+sgo',

    'a13+a14',
    'a14+a13',

    'pfi+a14',
    'a14+pfi',

    'a14+a21',
    'a21+a14',


    'a22+a24',
    'a24+a22',
    
    'sao+qai',
    'qai+sao',

    'qao+a24',
    'a24+qao',

    'eni+a24',
    'a24+eni',

    'eno+dei',
    'dei+eno',

    'deo+pfi',
    'pfi+deo',

    'pfo+lpfi',
    'lpfi+pfo',

    'lpfo+evi',
    'evi+lpfo',

    'sao+a11',
    'a11+sao',

    'a12+qai',
    'qai+a12',

    'a13+pfi',
    'pfi+a13',

    'a21+a13',
    'a13+a21',

    'qao+a22',
    'a22+qao',
    
    'a22+eni',
    'eni+a22',

    'a23+pfo',
    'pfo+a23',
];

function validConnection(c1, c2) {
    const connection = c1 + '+' + c2;
    console.log('connection: ', connection);
    if (validConnections.includes(connection)) {
        console.log('valid connection');
        return true;
    }
        console.log('invalid connection');
    return false;
}


const questions = {
    1: {
        "question": "In Delta modulation",
        "options": [
            "One bit per sample is transmitted",
            "All the coded bits used for sampling are transmitted",
            "The step size is fixed",
            "Both a) and c) are correct"
        ],
        "answer": "Both a) and c) are correct"
    },
    2: {
        "question": "The demodulator in delta modulation technique is",
        "options": [
            "Differentiator",
            "Integrator",
            "Quantizer",
            "None of the above"
        ],
        "answer": "Integrator"
    },
    3: {
        "question": "To achieve high signal to noise ratio, delta modulation must use",
        "options": [
            "Under sampling",
            "Over sampling",
            "Aliasing",
            "None of the mentioned"
        ],
        "answer": "Over sampling"
    },
    4: {
        "question": "In a single integration DM scheme the voiced signal is sampled at a rate of 64KHz. The maximum signal amplitude is 2V, voice signal bandwidth is 3.5KHz. Determine the minimum value of step size to avoid slope overload distortion and calculate granular noise power.",
        "options": [
            "0.687V and 8.6mW",
            "0.86V and 6.8mW",
            "1V and 2.12mW",
            "None of the mentioned"
        ],
        "answer": "0.687V and 8.6mW"
    },
    5: {
        "question": "State Nyquist Criteria for sampling the signals.",
        "options": [
            "Fs=fm",
            "Fs>=2fm",
            "Fs<=2fm",
            "Fs<fm"
        ],
        "answer": "Fs>=2fm"
    },
    6: {
        "question": "To achieve high signal to noise ratio, delta modulation must use",
        "options": [
            "Under sampling",
            "Over sampling",
            "Aliasing",
            "None of the mentioned"
        ],
        "answer": "Over sampling"
    }
};

function generateQuizQuestions() {
    let quizBody = document.getElementById("quizBody");
    for (const [qnno, qobj] of Object.entries(questions)) {
        let question_div = document.createElement("div");

        let question = document.createElement("h5");
        question.innerHTML = qnno + ') ' + qobj.question;

        question_div.appendChild(question);

        qobj.options.forEach((option) => {
            let b = document.createElement("input");

            b.type = "radio"
            b.name = 'qn'+qnno;
            b.value = option;
            b.style = "margin-left: 25px";
            let  c = document.createElement("label");
            c.for = qnno;
            c.innerText = option;
            c.style = "margin-left: 10px";
            question_div.appendChild(b);
            question_div.appendChild(c);

            question_div.appendChild(document.createElement("br"));
        });
        question_div.appendChild(document.createElement("br"));
        quizBody.append(question_div);
    }
}

function validateQuiz() {
    console.log('Validate Quiz');
    const num_questions = Object.entries(questions).length;
    const questionMap = new Map(Object.entries(questions));
    console.log(questionMap);
    for (let i = 1; i <= num_questions; i++) {
        const name = 'qn' + i;
        const elements = document.getElementsByName(name);
        let checked = false;
        elements.forEach((element) => {
            if (element.checked)
                checked = true;
        });
        if (!checked) {
            alert('Answer all questions');
            return ;
        }
    }
    const labels = document.getElementsByTagName('label');
    console.log('Labels: ', labels);

    for (let i = 1; i <= num_questions; i++) {
        const name = 'qn' + i;
        const elements = document.getElementsByName(name);

        let ans = '';
        elements.forEach((element) => {
            if (element.checked) {
                ans = element.value;
            }
        });
        const correct_ans = questionMap.get(`${i}`).answer;
        labels.forEach((label) => {
            if (label.for !== `${i}`)
                return ;
            if (label.innerText === correct_ans) {
                label.style = 'color: green; margin-left: 10px';
            } else if (label.innerText === ans && ans !== correct_ans) {
                label.style = 'color: red; margin-left: 10px';
            }
        });
    }
}

function showQuizes() {
    $('#quizModal').modal('show');
    generateQuizQuestions();
}

document.getElementById('quizbtn').onclick = showQuizes;
document.getElementById('submitbtn').onclick = validateQuiz;


function setup_modulation() {
    myblocks.set('generator', new SineGenerator(240-99, 112.5, 200, 100));
    myblocks.set('sampler', new Sampler(646.6-150, 112.5, 200, 100));
    myblocks.set('adder1', new Adder1(1053.32-210, 145.5, 20));
    myblocks.set('adder2', new Adder2(1460 - 120, 145 + 100, 20));
    myblocks.set('quantizer', new Quantizer(1053.32-59, 112.5, 220, 100));
    myblocks.set('predfilter1', new PredictionFilter(1053.32-59, 350, 220, 100));
    myblocks.set('encoder', new Encoder(1480, 112.5, 220, 100));
}

function setup_demodulation() {
    const offset = 60;
    myblocks.set('decoder', new Decoder(250 + offset, 587.6, 200, 100));
    myblocks.set('predfilter2', new PredictionFilter(650 + offset, 587.6, 220, 100));
    myblocks.set('lpf', new LowPassFilter(1070 + offset, 587.6, 220, 100));
    myblocks.set('eval', new Evaluate(1470 + offset, 587.6, 220, 100));
}

let totalConnection = 0;

function isCircuitComplete() {
    return totalConnection >= 14;
}

function openModal(obj, dblClick = false) {
    if (currentModal && !dblClick) {
        return ;
    }

    if (currentModal && dblClick) {
        $(`${currentModal}`).modal('hide');
        currentModal = null;
    }

    let _modalName = dblClick ? obj.doubleClickModal() : obj.singleClickModal();
    if (!_modalName) {
        return ;
    }
    const modalName = `#${_modalName}`;
    if (!isCircuitComplete()) {
        alert('Complete all the connections');
        return ;
    }

    $(modalName).modal('show');
    $(modalName).on('shown.bs.modal', function () {
        if (modalName === '#sourceWaveGraph') {
            drawSourceWave();
        } else if (modalName === '#sampledWaveGraph') {
            drawSampledWave();
        } else if (modalName === '#decoderWaveGraph') {
            drawDecoderWave();
        }else if (modalName === '#reconWaveGraph') {
            drawReconWave();
        } else if (modalName === '#quantizerOutput') {
            drawQuantizedWave();
        } else if (modalName === '#encodedWaveGraph') {
            drawEncodedWave();
        } else if (modalName === '#lpfWaveGraph') {
            drawLPFWave();
        } else if (modalName === '#evalWaveGraph') {
            drawEvaluateWave();
        }
    });
    currentModal = modalName;

    $(`${modalName}`).on('hidden.bs.modal', function () {
        currentModal = null;
    })
}

function doubleClicked() {
    myblocks.forEach((val, key) => {
        if (val.mouseOver()) {
            openModal(val, true);
        }
    });
}

let wireManager = new WireManager();
let currentStartNode = null;
let currentSelected = null;


function keyPressed() {
    if (keyCode === DELETE) {
        if (currentSelected) {
            console.log('removing ', currentSelected);
            wireManager.remove(currentSelected);
            totalConnection --;
            currentSelected = null;
        }
        components = [];
        if (currentStartNode) currentStartNode = null;
    }
    if (keyCode === ENTER) {
        console.log(components);
        console.log(wireManager);
    }
}

let components = [];

function mouseClicked() {
    let anySelected = false;
    if (currentSelected instanceof Wire) currentSelected.selected = false;
    connectionNodes.forEach((node) => {
        if (node.didClick()) {
            if (!currentStartNode) {
                currentStartNode = node;
                console.log('current start node: ', currentStartNode);
                components.push(currentStartNode);
            }
            else {
                components.push(node);
                console.log(components);
                console.log('adding wire from: ', currentStartNode, ' to ', node);
                const n = components.length;
                if (validConnection(components[0].name, components[n - 1].name)) {
                    totalConnection ++;
                    wireManager.addWire(components);
                    if (isCircuitComplete()) {
                        showQuizes();
                    }
                } else {
                    alert("Invalid Connection. Please check your connections");
                }
                currentStartNode = null;
                components = [];
            }
            anySelected = true;
        }
    });
    wireManager.wires.forEach((wire) => {
        if (wire.didClick()) {
            console.log('clicked on wire ', wire);
            currentSelected = wire;
            wire.selected = true;
            anySelected = true;
        }
    })
    if (!anySelected && currentStartNode) {
        const v = createVector(mouseX, mouseY)
        // line(currentStartNode.x, currentStartNode.y, v.x, v.y);
        components.push(v);
        currentStartNode = v;
    }

    if (!anySelected) { currentSelected = null; console.log('setting curretnSelcted to ', currentSelected); }
}

export function draw() {
    clear();

    myblocks.forEach((val, key) => {
        const highlight = val.mouseOver();
        val.draw(highlight);
    });

    wireManager.draw();

    if (components)
        new Wire(components).draw();

    if (currentStartNode)
        line(currentStartNode.x, currentStartNode.y, mouseX, mouseY);
}

export function setup() {
    createCanvas(windowWidth, windowHeight);

    setup_modulation();
    setup_demodulation();
}

/** @type {Window} */
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;
window.onclick = mouseClicked;
window.doubleClicked = doubleClicked;
window.onkeydown = keyPressed;