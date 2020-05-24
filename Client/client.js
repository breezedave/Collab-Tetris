var canvas = document.getElementById('frame');
var ctx = canvas.getContext('2d');
var socket = io("http://127.0.0.1:3000");
//var socket = io('http://www.vizchallenges.co.uk:3000');
var image = new Image;
var lastImage;

socket.on('frame', function (data) {
    if (lastImage && 'undefined' != typeof URL) {
        URL.revokeObjectURL(lastImage);
    }
    image.onload = function () { ctx.drawImage(image, 0, 0); };
    image.src = data;
});

document.addEventListener('keydown', function (e) {
    socket.emit('keydown', e.keyCode);
});
document.addEventListener('keyup', function (e) {
    socket.emit('keyup', e.keyCode);
});


var drawControls = function() {
    var canvas = document.getElementById('controls');
    var ctx = canvas.getContext('2d');

    canvas.width = 600;
    canvas.height = 200;

    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, 0, 600, 200);

    ctx.fillStyle = "#222a2c";
    ctx.fillRect(70, 10, 60, 180);
    ctx.fillRect(10, 70, 180, 60);

    ctx.fillStyle = "#7e255f";

    ctx.beginPath();
    ctx.arc(410, 100, 35, 0, 2 * Math.PI, false);
    ctx.arc(550, 90, 35, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.font = "30px arial";
    ctx.textAlign = "center";
    ctx.fillText("w", 100, 40);
    ctx.fillText("s", 100, 180);
    ctx.fillText("a", 30, 110);
    ctx.fillText("d", 170, 110);
    ctx.fillText("c", 410, 110);
    ctx.fillText("v", 550, 100);

}
drawControls();
