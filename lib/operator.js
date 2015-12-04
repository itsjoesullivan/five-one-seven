class Operator {
  constructor(context, operatorData, event) {
    this.gain = context.createGain();
    this.gain.gain.value = event.outputLevel;

    this.osc = context.createOscillator();
    this.osc.frequency.value = event.frequency * operatorData.ratio;
    this.osc.detune.value = operatorData.detune;
    this.frequency = this.osc.frequency;

    this.eg = data.eg;
    this.envelopeNode = context.createGain();

    this.osc.connect(this.envelopeNode);
    this.gain.connect(context.destination);
    this.envelopeNode.connect(this.gain);
  }
  connect(targetNode) {
    this.gain.connect(targetNode);
  }
  start(when) {
    var env = this.eg;
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
    var env = this.eg;
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
