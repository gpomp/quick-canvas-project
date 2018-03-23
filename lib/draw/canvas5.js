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
    const xWidth = parseInt(opts.xWidth) || 400;
    const yHeight = parseInt(opts.yHeight) || 400;
    let count = 0;
    ctx.fillStyle = "#000000";
    const randColor = !isNaN(parseInt(opts.forceColor)) ? parseInt(opts.forceColor) : Math.floor(colors.length * Math.random());
    const usedColors = colors[randColor];
    console.log('Current color ->', randColor);

    const color1 = ColorManipulation(usedColors[0]).desaturate(0.75).rgb().object();
    const color2 = ColorManipulation(usedColors[1]).desaturate(0.75).rgb().object();
    const color3 = ColorManipulation(usedColors[2]).desaturate(0.75).rgb().object();
    const color4 = ColorManipulation(usedColors[3]).desaturate(0.75).rgb().object();

    const margin = parseInt(opts.margin) || 10;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let prevY = -margin;
    for (let y = 0; y < yHeight; y++) {
        let prevX = -margin;
        const yRatio = y / yHeight;
        for (let x = 0; x < xWidth; x++) {
            const xRatio = x / xWidth;
            const distSquared = Math.abs((xRatio - 0.5) * (xRatio - 0.5) + (yRatio - 0.5) * (yRatio - 0.5)) / 0.5;
            const noiseWeight = 1 + (yRatio * 1.5);
            const noise = fbm(simplex, xRatio * noiseWeight, yRatio * noiseWeight);
            const noise1 = fbm(simplex1, xRatio * (noiseWeight * 3), yRatio * (noiseWeight * 3));
            const finalNoise = lerp(noise, noise1, distSquared);
            let xDraw = -margin + xRatio * (canvas.width + margin * 2);
            let yDraw = -margin + yRatio * (canvas.height + margin * 2) + finalNoise * (10 + 2 * distSquared);
            if (x !== 0) {
                ctx.beginPath();
                const colmix1R = lerp(color1.r, color2.r, (noise + 1.0) * 0.5);
                const colmix2R = lerp(color3.r, color4.r, (noise1 + 1.0) * 0.5);
                const colmixR = Math.round(lerp(colmix1R, colmix2R, distSquared));

                const colmix1G = lerp(color1.g, color2.g, (noise + 1.0) * 0.5);
                const colmix2G = lerp(color3.g, color4.g, (noise1 + 1.0) * 0.5);
                const colmixG = Math.round(lerp(colmix1G, colmix2G, distSquared));

                const colmix1B = lerp(color1.b, color2.b, (noise + 1.0) * 0.5);
                const colmix2B = lerp(color3.b, color4.b, (noise1 + 1.0) * 0.5);
                const colmixB = Math.round(lerp(colmix1B, colmix2B, distSquared));

                ctx.strokeStyle = `rgba(${colmixR}, ${colmixG}, ${colmixB}, 1.0)`;
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(xDraw, yDraw);
                ctx.stroke();
            }

            prevY = yDraw;
            prevX = xDraw;
            /* let boxX = canvas.width * (x / xWidth);
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
            count++; */
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