var Operator = require('./operator');
var algorithms = require('./algorithms');

class Voice {
  constructor(context, patch, event) {
    this.output = context.createGain();
    var ops = patch.operators.map(function(operatorData) {
      return new Operator(context, operatorData, event);
    });
    algorithms[this.algorithmNumber - 1](ops, output);
  }
  connect(targetNode) {
    this.output.connect(targetNode);
  }
  start(when) {
    this.ops.forEach(function(op) {
      op.start(when);
    });
  }
  release(when) {
    this.ops.forEach(function(op) {
      op.release(when);
    });
  }
  stop(when) {
    this.ops.forEach(function(op) {
      op.stop(when);
    });
  }
}
