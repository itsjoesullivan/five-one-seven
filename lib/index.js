var FriendlyMIDI = require('friendly-midi').default;
var midi = new FriendlyMIDI();
midi.on('noteOn', function(data) {
  go(data);
});


var context = new AudioContext();


function go(data) {

  var now = context.currentTime;
  var frequency = data.frequency;

  var carrier = context.createOscillator();
  carrier.frequency.value = frequency;
  var carrierGain = context.createGain();
  carrierGain.gain.setValueAtTime(0, now);

  var modulator = context.createOscillator();
  modulator.frequency.value = frequency * 18;
  var modulatorGain = context.createGain();
  modulatorGain.gain.setValueAtTime(0, now);

  modulator.connect(modulatorGain);
  modulatorGain.connect(carrier.frequency);

  carrier.connect(carrierGain);
  carrierGain.connect(context.destination);

  modulator.start(context.currentTime);
  carrier.start(context.currentTime);

  [ [0, 0], [10, 1], [20, 0.9], [50, 0.8], [300, 0.8], [500, 0]].forEach(function(point) {
    if (point[0] === 0) {
      point[0] = 0.000001;
    }
    modulatorGain.gain.exponentialRampToValueAtTime(300 * point[0], now + point[1] / 1000);
  });

  [ [0, 0], [10, 1], [20, 0.9], [50, 0.8], [100, 0.8], [1000, 0]].forEach(function(point) {
    if (point[1] === 0) {
      point[1] = 0.000001;
    }
    carrierGain.gain.exponentialRampToValueAtTime(point[1], now + (point[0] / 1000));
  });


  var carrier = context.createOscillator();
  carrier.frequency.value = frequency;
  var carrierGain = context.createGain();
  carrierGain.gain.setValueAtTime(0, now);

  var modulator = context.createOscillator();
  modulator.frequency.value = frequency * 18;
  var modulatorGain = context.createGain();
  modulatorGain.gain.setValueAtTime(0, now);

  modulator.connect(modulatorGain);
  modulatorGain.connect(carrier.frequency);

  carrier.connect(carrierGain);
  carrierGain.connect(context.destination);

  //modulator.start(context.currentTime);
  carrier.start(context.currentTime);

  [ [0, 0], [10, 1], [20, 0.9], [50, 0.8], [300, 0.8], [500, 0]].forEach(function(point) {
    if (point[0] === 0) {
      point[0] = 0.000001;
    }
    modulatorGain.gain.exponentialRampToValueAtTime(600 * point[0], now + point[1] / 1000);
  });

  [ [0, 0], [10, 1], [20, 0.9], [50, 0.8], [900, 0.8], [3300, 0]].forEach(function(point) {
    if (point[1] === 0) {
      point[1] = 0.000001;
    }
    carrierGain.gain.exponentialRampToValueAtTime(point[1], now + (point[0] / 1000));
  });

}

