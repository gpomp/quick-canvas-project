module.exports = canvasFunction;

function canvasFunction(canvas, ctx) {
    canvas.width = 200;
    canvas.height = 200;

    ctx.fillStyle = "#FF0000";

    ctx.fillRect(10, 10, 40, 40);
}