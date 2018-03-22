const colors = require('nice-color-palettes');
const SimplexNoise = require('simplex-noise');
const smoothstep = require('smoothstep');
module.exports = canvasFunction;

function canvasFunction(canvas, ctx, opts = {}) {
    canvas.width = parseInt(opts.width) || 1000;
    canvas.height = parseInt(opts.height) || 1000;
    const nbPoint = parseInt(opts.nbPoint) || 1000;
    const simplex = new SimplexNoise();

    const usedColors = colors[Math.floor(colors.length * Math.random())];
    const length = parseInt(opts.iteration) || 500;
    let radius = canvas.width / 2;
    let x = canvas.width * 0.25 + Math.floor(Math.random() * canvas.width * 0.5);
    let y = canvas.height * 0.25 + Math.floor(Math.random() * canvas.height * 0.5);
    for (let i = 0; i < length; i++) {
        const t = smoothstep(0.6, 0, i / length);
        drawCircle(ctx, usedColors[i % usedColors.length], simplex, x, y, radius, i / length, t, nbPoint);
        radius -= 20 + (1 - t) * 40;
    }

}

function drawCircle(ctx, color, simplex, x, y, radius, ratio, t, nbPoint) {
    // let angle = Math.random() * Math.PI * 2;
    // let angle = 0;
    let angle = (1 - ratio) * Math.PI * 2;
    let angleStart = angle;
    ctx.strokeStyle = color;
    ctx.lineWidth = 42 + t * 40;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    const angleAdd = Math.PI * 2 / nbPoint;
    const noiseWeight = 0.6;
    for (let i = 0; i < nbPoint; i++) {
        // 
        const r = simplex.noise2D(angle * noiseWeight, ratio * noiseWeight) * ((ratio) * 1000) * smoothstep(angleStart + Math.PI * 2, angleStart + Math.PI * 2 - 0.2, angle) * smoothstep(angleStart, angleStart + 0.2, angle);
        ctx.lineTo(x + Math.cos(angle) * (radius + r), y + Math.sin(angle) * (radius + r));
        angle += angleAdd;
    }

    ctx.closePath();
    ctx.stroke();
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}