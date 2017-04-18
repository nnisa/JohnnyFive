'use strict';

const five = require('johnny-five');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let led = null;

app.use(express.static(__dirname + '/'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html')
});

five.Board().on('ready', function() {
  console.log('Arduino is ready.');
    /**
   * Motor A: PWM 11, dir 12
   * Motor B: PWM 5, dir 4
   */
   var speed, commands;
   commands = null;
   speed = 255;

   var motors = new five.Motors([
     { pins: { dir: 12, pwm: 11 }, invertPWM: true },
     { pins: { dir: 4, pwm: 5}, invertPWM: true }
   ]);

  five.Board().repl.inject({
    motors: motors
  });

  io.on('connection', function (socket) {
    socket.on('stop', function () {
      console.log("stop!");
      motors.stop();
    });

    socket.on('start', function () {
      console.log("Full speed ahead!");
      speed = 150;
      motors.forward(speed);
    });

    socket.on('reverse', function () {
      console.log("Now backwards!");
      speed = 120;
      motors.reverse(speed);
    });

    socket.on('left', function () {
      console.log("To the left!");
      var aSpeed = 220;
      var bSpeed = 50;
      motors[0].reverse(bSpeed);
      motors[1].forward(aSpeed);
      // motors.a.fwd(aSpeed);
      // motors.b.rev(bSpeed);
    });

    socket.on('right', function () {
      console.log("To the right!");
      var aSpeed = 50;
      var bSpeed = 220;
      motors[0].forward(bSpeed);
      motors[1].reverse(aSpeed);
      // motors.a.rev(aSpeed);
      // motors.b.fwd(bSpeed);
    });
});
});

const port = process.env.PORT || 3000;

server.listen(port);
console.log(`Server listening on http://localhost:${port}`);