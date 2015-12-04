import Voice from 'voice'

class FiveOneSeven {
  constructor(context, patch) {
    this.context = context;
    this.patch = patch;
  }
  noteOn(data) {
    var voice = new Voice(this.context, this.patch, data);
  }
}
