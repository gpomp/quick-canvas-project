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
    // const yHeight = parseInt(opts.yHeight) || 400;
    const randColor = !isNaN(parseInt(opts.forceColor)) ? parseInt(opts.forceColor) : Math.floor(colors.length * Math.random());
    const usedColors = colors[50];
    console.log('Current color ->', randColor);

    const margin = parseInt(opts.margin) || 10;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let prevY = -margin;
    let superY = -200;
    let count = 0;
    
    while(superY < canvas.height + 200) {
        const mHeight = 200 + (Math.random() - Math.random()) * 50;
        drawHeight(superY, mHeight, Math.random(), Math.random());
        superY += mHeight;
    }

    function drawHeight(sY, height, rand, rand2) {
        let prevX = -margin;
        let y = sY;
        const yAdd = parseFloat(opts.yAdd) || 20;
        while (y < sY + height) {
            const noiseWeight = 2.0;
            // const decrease = smoothstep(0, height, y - sY);.darken(decrease).desaturate(decrease)
            const color1 = ColorManipulation(usedColors[count % usedColors.length]).rgb().object();
            ctx.fillStyle = `rgba(${Math.round(color1.r)}, ${Math.round(color1.g)}, ${Math.round(color1.b)}, 1.0)`;
            count++;
            ctx.strokeStyle = `#FFFFFF`;
            ctx.lineWidth = 20;
            ctx.beginPath();
            let xDraw = 0;
            let yDraw = 0;
            for (let x = 0; x < xWidth; x++) {
                const xRatio = x / xWidth;
                const distX = (xRatio * (canvas.width + margin * 2) - canvas.width * 0.5) / (canvas.width * 0.5);
                const distY = (-margin + y - canvas.height * 0.5) / (canvas.height * 0.5);
                const dist = Math.sqrt(distX * distX + distY * distY);
                //+ (yRatio * 1.5);
                // const noise = fbm(simplex, (xRatio * rand) * noiseWeight, (y / canvas.height * rand) * noiseWeight);
                // const noise1 = fbm(simplex1, xRatio * noiseWeight, y / canvas.height * noiseWeight);
                xDraw = -margin + xRatio * (canvas.width + margin * 2);
                // yDraw = -margin + y + noise * (10 + 3 * noise1);
                yDraw = -margin + y + Math.sin((dist * 1000) * Math.PI * 0.01) * (10 + rand2 * 70);
                if (x !== 0) {

                    ctx.lineTo(xDraw, yDraw);
                } else {
                    ctx.moveTo(xDraw, yDraw);
                }
            }

            ctx.lineTo(xDraw, y + height);
            ctx.lineTo(0, y + height);
            ctx.closePath();
            ctx.fill();

            y += yAdd;
        }
        ctx.stroke();
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