module.exports = createApp;

function createApp (options = {}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  document.body.appendChild(canvas);

  if (options.program) {
    options.program(canvas, ctx);
  }

}