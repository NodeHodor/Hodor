var OLEDExp = require('onion-oled-js').OLEDExp;

OLEDExp.powerOn()
  .then(OLEDExp.initialize)
  .then(() => OLEDExp.write('first thing', 0, 5))
  .then(() => OLEDExp.write('second thing too', 1, 1))
  .then(() => OLEDExp.cursor(3, 0))
  .then(() => OLEDExp.write('really really really really really really long sentence'));


OLEDExp.powerOff()

OLEDExp.power("on")
OLEDExp.write('first thing', 0, 5);
OLEDExp.write('second thing too', 1, 1);
OLEDExp.cursor(3, 0);
OLEDExp.power("off")
OLEDExp.clear();