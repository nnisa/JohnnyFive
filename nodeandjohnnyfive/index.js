var five = require('johnny-five'),
board= new five.Board(),
led,
toggleState = false;

board.on("ready", function() {
	console.log('board ready');
	led = new five.Led(13);
	setInterval(toggleLED, 1000);

	function toggleLED() {
		toggleState!=toggleState;

		if(toggleState) led.on();
		else led.off();
	}
});

console.log("\n waiting for the connection");