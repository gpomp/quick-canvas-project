const { createCanvas } = require('canvas');
const canvasToRender = process.argv.length >= 2 ? `../lib/draw/${process.argv[2]}` : "../lib/draw/canvas1";
const canvasFunction = require(canvasToRender);
const fs = require("fs");


function saveCanvas() {
    console.log("begin canvas...");
    const canvas = createCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    const opts = {};
    if (process.argv.length > 4) {
        for (let i = 4; i < process.argv.length; i++) {
            const arg = process.argv[i].split('=');
            opts[arg[0]] = arg[1];
        }
    }
    canvasFunction(canvas, ctx, opts);
    console.log("draw canvas...");

    const buf = canvas.toBuffer();
    fs.writeFileSync(`app/exports/${process.argv.length > 3 ? process.argv[3] : "canvas-export"}.png`, buf, (err) => {
        // throws an error, you could also catch it here
        if(err) throw err;

        // success case, the file was saved
        console.log('image saved!');
    });
}

saveCanvas();