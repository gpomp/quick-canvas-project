const colors = require('nice-color-palettes');
module.exports = canvasFunction;

function canvasFunction(canvas, ctx, opts = {}) {
    canvas.width = parseInt(opts.width) || 1000;
    canvas.height = parseInt(opts.height) || 1000;

    const usedColors = colors[Math.floor(colors.length * Math.random())];
    const length = parseInt(opts.iteration) || 50;
    for (let i = 0; i < length; i++) {
        drawCircles(ctx, Math.random() * canvas.width, Math.random() * canvas.height, usedColors);
        
    }

}

function drawCircles (ctx, x, y, usedColors) {
    const nbCircle = Math.floor(3 + Math.random() * 6);
    let startRadius = 150 + Math.random() * 150;

    const randColors = shuffle(usedColors.slice());
    for(let i = 0; i < nbCircle; i++) {
        const currColor = randColors[i%usedColors.length];
        ctx.fillStyle = currColor;
        ctx.beginPath();
        ctx.arc(x, y, startRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        startRadius -= startRadius * 0.2;
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}