require('babel-polyfill');
const query = require('./util/query');

const createApp = require("./app/createApp");
const canvasFunction = require("./draw/canvas9");

startApp();

function startApp () {
  createApp({
    program: canvasFunction
  });
}
