## Usage

```javascript
var Synth = require('five-one-seven');

var context = new AudioContext();
var synth = new Synth(context, patch);

note = synth.noteOn(noteOnData);
note.connect(context.destination);
```


### Resources

http://www.chipple.net/dx7/english/fm.tone.generation.html
http://www.christopher.net.nz/dx7_tx7.html
http://self.gutenberg.org/articles/dx7_rhodes
http://www.attackmagazine.com/technique/tutorials/fm-electric-piano/2/
https://homepages.abdn.ac.uk/mth192/pages/dx7/manuals/prgrmdx7.pdf
https://homepages.abdn.ac.uk/mth192/pages/dx7/sysex-format.txt
http://sourceforge.net/u/tedfelix/dx7dump/ci/master/tree/
http://www.manualslib.com/manual/196296/Yamaha-Dx7.html?page=29
http://www.chipple.net/dx7/fig15-4.gif
http://www.sketchappsources.com/resources/source-images-plus1/Yamaha-DX7-1.png

