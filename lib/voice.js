var Operator = require('./operator');
var algorithms = require('./algorithms');

class Voice {
  constructor(data) {
    this.output = context.createGain();
    this.patch.operators.map(function(operatorData) {
      return new Operator(data, operatorData);
    });
    algorithms[this.algorithmNumber - 1](this.getOperators(data), output);
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
