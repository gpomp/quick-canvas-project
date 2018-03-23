const colors = require('nice-color-palettes');
const SimplexNoise = require('simplex-noise');
const ColorManipulation = require('color');
const lerp = require('lerp');
const smoothstep = require('smoothstep');
module.exports = canvasFunction;

function canvasFunction(canvas, ctx, opts = {}) {
    canvas.width = parseInt(opts.width) || 1000;
    canvas.height = parseInt(opts.height) || 1000;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const simplex = new SimplexNoise();
    const simplex1 = new SimplexNoise('different seed');
    const randColor = !isNaN(parseInt(opts.forceColor)) ? parseInt(opts.forceColor) : Math.floor(colors.length * Math.random());
    const usedColors = colors[randColor];
    const distX = canvas.width;
    const distY = canvas.height;
    const totalStep = parseInt(opts.totalStep) || 400;
    const nbLines = parseInt(opts.nbLines) || 10;
    const nbTentacles = parseInt(opts.nbTentacles) || 50;
    const nbBigStep = Math.PI * 2 / nbTentacles;
    let angle = 0;
    for (let i = 0; i < nbTentacles; i++) {
        drawTentacle(distX * 0.5 + Math.cos(angle) * distX, distY * 0.5 + Math.sin(angle) * distY, canvas.width, canvas.height, ctx, simplex, simplex1, totalStep, nbLines);
        angle += nbBigStep + (Math.random() - Math.random()) * nbBigStep * 0.2;
    }
}

function drawTentacle(xStart, yStart, cWidth, cHeight, ctx, simplex, simplex1, totalStep, nbLines) {
    const finishX = cWidth * 0.5 + (Math.random() - Math.random()) * cWidth * 0.25;
    const finishY = cHeight * 0.5 + (Math.random() - Math.random()) * cHeight * 0.25;
    const distX = xStart - finishX;
    const distY = yStart - finishY;
    const generalAngle = Math.atan2(distY, distX) - Math.PI;
    const dist = Math.sqrt(distX * distX + distY * distY);
    for (let j = 0; j < nbLines; j++) {
        const rad = 20 + (Math.random() - Math.random()) * 10;
        let prevX = xStart;
        let prevY = yStart;
        for (let i = 0; i < totalStep; i++) {
            const noiseWeight = 0.001;// + (i / totalStep * 150);
            let x = xStart + Math.cos(generalAngle) * (dist * i / totalStep);
            let y = yStart + Math.sin(generalAngle) * (dist * i / totalStep);
            const noise0 = fbm(simplex, (x + j * 2) * noiseWeight, (y + j * 2) * noiseWeight);
            const noise1 = fbm(simplex1, (x + j * 2) * noiseWeight, (y + j * 2) * noiseWeight);
            const noise = (noise0 + noise1) * 0.5;
            x += Math.cos((noise) * Math.PI * 0.4) * (rad + noise);
            y += Math.sin((noise) * Math.PI * 0.4) * (rad + noise);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * smoothstep(0.85, 0.5, i / totalStep) * (0.5 + (j / nbLines))})`;
            ctx.lineWidth = 4 + (1 - i / totalStep) * 12;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            // ctx.arc(x, y, startRadius * (1 - i / totalStep), 0, Math.PI * 2);
            ctx.stroke();
            prevX = x;
            prevY = y;
        }
    }
}

function fbm(simplex, x, y) {
    // Initial values
    let noise = 0;
    let amplitude = 5;
    let frequency = 0.;
    //
    // Loop of octaves
    for (let i = 0; i < 20; i++) {
        noise += amplitude * simplex.noise2D(x, y);
        x *= 2.;
        y *= 2.;
        amplitude *= .5;
    }
    return noise;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}