(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"friendly-midi":3}],2:[function(require,module,exports){
require('./lib/index');

},{"./lib/index":1}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _midiutils = require('midiutils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FriendlyMIDI = (function (_EventEmitter) {
  _inherits(FriendlyMIDI, _EventEmitter);

  function FriendlyMIDI() {
    _classCallCheck(this, FriendlyMIDI);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FriendlyMIDI).call(this));

    navigator.requestMIDIAccess().then(function (access) {
      _this.access = access;
      access.onstatechange = _this.handleAccessStateChange.bind(_this);
      _this.applyListenersToMIDIInputs();
      _this.emit('ready');
    }, function (error) {
      _this.emit('error', error);
    });
    return _this;
  }

  _createClass(FriendlyMIDI, [{
    key: 'midiMessageHandler',
    value: function midiMessageHandler(event) {
      this.emit(event.type, event.data, event);
      var data = event.data;
      var status = data[0];

      if (this.statusIsNoteOn(status)) {
        this.emit('noteOn', {
          note: (0, _midiutils.noteNumberToName)(data[1]),
          frequency: (0, _midiutils.noteNumberToFrequency)(data[1]),
          noteNumber: data[1],
          velocity: data[2]
        });
      } else if (this.statusIsNoteOff(status)) {
        this.emit('noteOff', {
          note: (0, _midiutils.noteNumberToName)(data[1]),
          frequency: (0, _midiutils.noteNumberToFrequency)(data[1]),
          noteNumber: data[1],
          velocity: data[2]
        });
      } else if (this.statusIsPitchBend(status)) {
        this.emit('pitchBend', data[2]);
      } else if (this.statusIsControlChange(status)) {
        if (this.controlChangeIsModulation(data[1])) {
          this.emit('modulation', data[2]);
        }
      }
    }
  }, {
    key: 'statusIsNoteOn',
    value: function statusIsNoteOn(status) {
      return status >= 144 && status <= 159;
    }
  }, {
    key: 'statusIsNoteOff',
    value: function statusIsNoteOff(status) {
      return status >= 128 && status <= 143;
    }
  }, {
    key: 'statusIsPitchBend',
    value: function statusIsPitchBend(status) {
      return status >= 224 && status <= 239;
    }
  }, {
    key: 'statusIsControlChange',
    value: function statusIsControlChange(status) {
      return status >= 176 && status <= 191;
    }
  }, {
    key: 'controlChangeIsModulation',
    value: function controlChangeIsModulation(value) {
      return value === 1;
    }
  }, {
    key: 'applyListenersToMIDIInputs',
    value: function applyListenersToMIDIInputs() {
      this.access.inputs.forEach(this.applyListenerToMIDIInput.bind(this));
    }
  }, {
    key: 'applyListenerToMIDIInput',
    value: function applyListenerToMIDIInput(input) {
      input.onmidimessage = this.midiMessageHandler.bind(this);
    }
  }, {
    key: 'handleAccessStateChange',
    value: function handleAccessStateChange(e) {
      this.emit('statechange', e);
      this.applyListenersToMIDIInputs(this.access);
    }
  }]);

  return FriendlyMIDI;
})(_events.EventEmitter);

exports.default = FriendlyMIDI;
},{"events":5,"midiutils":4}],4:[function(require,module,exports){
(function() {

	var noteMap = {};
	var noteNumberMap = [];
	var notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];


	for(var i = 0; i < 127; i++) {

		var index = i,
			key = notes[index % 12],
			octave = ((index / 12) | 0) - 1; // MIDI scale starts at octave = -1

		if(key.length === 1) {
			key = key + '-';
		}

		key += octave;

		noteMap[key] = i;
		noteNumberMap[i] = key;

	}


	function getBaseLog(value, base) {
		return Math.log(value) / Math.log(base);
	}


	var MIDIUtils = {

		noteNameToNoteNumber: function(name) {
			return noteMap[name];
		},

		noteNumberToFrequency: function(note) {
			return 440.0 * Math.pow(2, (note - 69.0) / 12.0);
		},

		noteNumberToName: function(note) {
			return noteNumberMap[note];
		},

		frequencyToNoteNumber: function(f) {
			return Math.round(12.0 * getBaseLog(f / 440.0, 2) + 69);
		}

	};


	// Make it compatible for require.js/AMD loader(s)
	if(typeof define === 'function' && define.amd) {
		define(function() { return MIDIUtils; });
	} else if(typeof module !== 'undefined' && module.exports) {
		// And for npm/node.js
		module.exports = MIDIUtils;
	} else {
		this.MIDIUtils = MIDIUtils;
	}


}).call(this);


},{}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[2]);
