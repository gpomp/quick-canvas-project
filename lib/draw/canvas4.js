const colors = require('nice-color-palettes');
const SimplexNoise = require('simplex-noise');
const lerp = require('lerp');
const smoothstep = require('smoothstep');
module.exports = canvasFunction;

function canvasFunction(canvas, ctx, opts = {}) {
    canvas.width = parseInt(opts.width) || 1000;
    canvas.height = parseInt(opts.height) || 1000;
    const simplex = new SimplexNoise();
    const simplex1 = new SimplexNoise('different seed');
    const xWidth = parseInt(opts.xWidth) || 49;
    const yHeight = parseInt(opts.yHeight) || 49;
    let count = 0;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const boxWidth = 1 / xWidth * canvas.width;
    const boxHeight = 1 / yHeight * canvas.height;
    const noiseWeight = 0.04;
    for (let x = 0; x < xWidth; x++) {
        for (let y = 0; y < yHeight; y++) {
            let boxX = canvas.width * (x / xWidth);
            let boxY = canvas.height * (y / yHeight);
            // ctx.fillStyle = (x + xWidth * y) % 2 === 0 ? "#000000" : "#FF0000";
            // ctx.fillStyle = "#000000";
            // ctx.fillRect(boxX, boxY, 1 / xWidth * canvas.width, 1 / yHeight * canvas.height);
            ctx.fillStyle = "#ffffff";
            const noise = fbm(simplex, x * noiseWeight, y * noiseWeight, noiseWeight);
            const noise1 = fbm(simplex1, x * noiseWeight, y * noiseWeight, noiseWeight);
            ctx.save();
            ctx.translate(boxX + boxWidth * 0.5, boxY + boxHeight * 0.5);
            ctx.rotate(lerp(noise, noise1, smoothstep(xWidth / 2 - xWidth * 0.1, xWidth / 2 + xWidth * 0.1, x)) * Math.PI);
            ctx.fillRect(0, -boxHeight * 0.5, 5 + 1 * noise, boxHeight);
            ctx.restore();
            count++;
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