const colors = require('nice-color-palettes');
const ColorManipulation = require('color');
const SimplexNoise = require('simplex-noise');
const lerp = require('lerp');
const smoothstep = require('smoothstep');
module.exports = canvasFunction;

function canvasFunction(canvas, ctx, opts = {}) {
    canvas.width = parseInt(opts.width) || 1000;
    canvas.height = parseInt(opts.height) || 1000;
    const simplex = new SimplexNoise();
    const simplex1 = new SimplexNoise('different seed');
    // const yHeight = parseInt(opts.yHeight) || 400; 71
    const randColor = !isNaN(parseInt(opts.forceColor)) ? parseInt(opts.forceColor) : Math.floor(colors.length * Math.random());
    const usedColors = colors[randColor];
    console.log('Current color ->', randColor);
    const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grd.addColorStop(0, usedColors[0]);
    grd.addColorStop(1, usedColors[1]);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const rectSize = parseInt(opts.rectSize) || 100;

    const restColors = [usedColors[2], usedColors[3], usedColors[4]];
    const nbEls = 1000;
    const radius = 100;
    /* for (let i = 0; i < nbEls; i++) {
        const x = i / nbEls * canvas.width;
        const y = i / nbEls * canvas.height;
        ctx.save();
        ctx.fillStyle = restColors[i % restColors.length];
        ctx.translate(x, y);
        ctx.rotate(i / nbEls * (Math.PI * 2));
        ctx.fillRect(0, 0, rectSize, rectSize);
        ctx.restore();
    } */
    const noiseWeight = 0.002;

    let yTube = 0;
    const nbTube = parseInt(opts.nbTube) || 20;
    for (let i = 0; i < nbTube; i++) {
        tube(canvas.height * (i / nbTube));
    }

    function tube (y) {
        let locY = y;
        for (let i = 0; i < nbEls; i++) {
            const x = i / nbEls * (canvas.width * 2);
            locY += Math.sin(i * 0.05) * 2;
            ctx.save();
            ctx.fillStyle = restColors[i % restColors.length];
            ctx.beginPath();
            ctx.translate(x, locY);
            const noise = fbm(simplex, x * noiseWeight, locY * noiseWeight);
            // ctx.rotate(i / nbEls * (Math.PI * 2));
            const rad = (radius + (noise + 3) * radius * 0.3) * 0.3 + i / nbEls * 0.3;
            ctx.arc(0, 0, Math.abs(rad), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
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

// npm run renderImage -- canvas5 noiseSimple-tryGap width=3508 height=4961 xWidth=2500 yHeight=3500 margin=20 forceColor=0