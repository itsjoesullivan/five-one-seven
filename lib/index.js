var FriendlyMIDI = require('friendly-midi').default;

var midi = new FriendlyMIDI();

var context = new AudioContext();

var notes = {};

midi.on('noteOn', function(data) {
  var voice = go(data);
  voice.connect(context.destination);
  voice.start(context.currentTime + 0.02);
  notes[data.note] = voice;
});
midi.on('noteOff', function(data) {
  notes[data.note].release(context.currentTime);
});

class Operator {
  constructor(data) {
    this.gain = context.createGain();
    this.gain.gain.value = data.output;

    this.osc = context.createOscillator();
    this.osc.frequency.value = data.rootFrequency * data.ratio;
    this.osc.detune.value = data.detune;
    this.frequency = this.osc.frequency;

    this.envelopeData = data.envelope;
    this.envelopeNode = context.createGain();

    this.osc.connect(this.envelopeNode);
    this.gain.connect(context.destination);
    this.envelopeNode.connect(this.gain);
  }
  connect(targetNode) {
    this.gain.connect(targetNode);
  }
  start(when) {
    var env = this.envelopeData;
    this.osc.start(when);
    this.envelopeNode.gain.setValueAtTime(0, when);
    var arriveAt1At = when + this.getDuration(env[0].rate, env[0].level);
    var arriveAt2At = arriveAt1At + this.getDuration(env[1].rate, Math.abs(env[1].level - env[0].level));
    var arriveAt3At = arriveAt2At + this.getDuration(env[2].rate, Math.abs(env[2].level - env[1].level));
    this.envelopeNode.gain
      .exponentialRampToValueAtTime(env[0].level, arriveAt1At);
    this.envelopeNode.gain
      .exponentialRampToValueAtTime(env[1].level, arriveAt2At);
    this.envelopeNode.gain
      .exponentialRampToValueAtTime(env[2].level, arriveAt3At);
  }
  getDuration(speed, distance) {
    // This method needs tweaking big time.
    var dur = distance / speed / 10;
    return dur;
  }
  release(when) {
    var env = this.envelopeData;
    var releaseFinishTime = when + this.getDuration(env[3].rate, Math.abs(this.envelopeNode.gain.value - env[2].level));
    this.envelopeNode.gain.cancelScheduledValues(when);
    this.envelopeNode.gain
      .exponentialRampToValueAtTime(env[3].level, releaseFinishTime);
    this.stop(releaseFinishTime);
  }
  stop(when) {
    this.osc.stop(when);
  }
}


function go(data) {
  var now = context.currentTime;
  var frequency = data.frequency;
  var ops = [
    new Operator({
      rootFrequency: frequency,
      ratio: 1,
      detune: 3,
      envelope: [
        {
          rate: 0.96,
          level: 1
        },
        {
          rate: 0.25,
          level: 0.75
        },
        {
          rate: 0.25,
          level: 0.00001
        },
        {
          rate: 0.67,
          level: 0.00001
        }
      ],
      output: 1
    }),
    new Operator({
      rootFrequency: frequency,
      ratio: 14,
      detune: 0,
      envelope: [
        {
          rate: 0.95,
          level: 0.99
        },
        {
          rate: 0.5,
          level: 0.75
        },
        {
          rate: 0.35,
          level: 0.00001
        },
        {
          rate: 0.78,
          level: 0.00001
        }
      ],
      output: 0.58
    }),
    new Operator({
      rootFrequency: frequency,
      ratio: 1,
      detune: 0,
      envelope: [
        {
          rate: 0.95,
          level: 0.99
        },
        {
          rate: 0.20,
          level: 0.95
        },
        {
          rate: 0.20,
          level: 0.0001
        },
        {
          rate: 0.50,
          level: 0.0001
        }
      ],
      output: 1
    }),
    new Operator({
      rootFrequency: frequency,
      ratio: 1,
      detune: 0,
      envelope: [
        {
          rate: 0.95,
          level: 0.99
        },
        {
          rate: 0.29,
          level: 0.95
        },
        {
          rate: 0.20,
          level: 0.0001
        },
        {
          rate: 0.50,
          level: 0.0001
        }
      ],
      output: 0.89
    }),
    new Operator({
      rootFrequency: frequency,
      ratio: 1,
      detune: -7,
      envelope: [
        {
          rate: 0.95,
          level: 0.99
        },
        {
          rate: 0.20,
          level: 0.95
        },
        {
          rate: 0.10,
          level: 0.5
        },
        {
          rate: 0.01,
          level: 0.0001
        }
      ],
      output: 0.99
    }),
    new Operator({
      rootFrequency: frequency,
      ratio: 1,
      detune: 7,
      envelope: [
        {
          rate: 0.95,
          level: 0.99
        },
        {
          rate: 0.29,
          level: 0.95
        },
        {
          rate: 0.20,
          level: 0.5
        },
        {
          rate: 0.10,
          level: 0.0001
        }
      ],
      output: 0.79
    }),
  ];

  var output = context.createGain();

  let [op1, op2, op3, op4, op5, op6] = ops;

  op2.connect(op1.frequency);
  op4.connect(op3.frequency);
  op6.connect(op6.frequency);
  op6.connect(op5.frequency);

  op1.connect(output);
  op3.connect(output);
  op5.connect(output);

  return {
    start: function(when) {
      ops.forEach(function(op) {
        op.start(when);
      });
    },
    stop: function(when) {
      ops.forEach(function(op) {
        op.stop(when);
      });
    },
    release: function(when) {
      ops.forEach(function(op) {
        op.release(when);
      });
    },
    connect: function(targetNode) {
      output.connect(targetNode);
    }
  };
};

