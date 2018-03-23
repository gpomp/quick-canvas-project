const colors = require('nice-color-palettes');
const SimplexNoise = require('simplex-noise');
const ColorManipulation = require('color');
const lerp = require('lerp');
const smoothstep = require('smoothstep');
module.exports = canvasFunction;

function canvasFunction(canvas, ctx, opts = {}) {
    canvas.width = parseInt(opts.width) || 1000;
    canvas.height = parseInt(opts.height) || 1000;
    const simplex = new SimplexNoise();
    const simplex1 = new SimplexNoise('different seed');
    const randColor = !isNaN(parseInt(opts.forceColor)) ? parseInt(opts.forceColor) : Math.floor(colors.length * Math.random());
    const usedColors = colors[randColor];
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