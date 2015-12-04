var FriendlyMIDI = require('friendly-midi').default;

var midi = new FriendlyMIDI();

var context = new AudioContext();

var notes = {};

midi.on('noteOn', function(data) {
  var voice = new Voice(data);
  voice.connect(context.destination);
  voice.start(context.currentTime + 0.02);
  notes[data.note] = voice;
});
midi.on('noteOff', function(data) {
  notes[data.note].release(context.currentTime);
});
