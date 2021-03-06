'use strict';

const Gpio = require('onoff').Gpio;

const top = new Gpio(20, 'out');
const tr = new Gpio(21, 'out');
const br = new Gpio(13, 'out');
const btm = new Gpio(16, 'out');
const bl = new Gpio(17, 'out');
const tl = new Gpio(19, 'out');
const ctr = new Gpio(18, 'out');
const dot = new Gpio(12, 'out');

const lights = [top, tr, br, btm, bl, tl, ctr, dot];

const letters = {
  0: [1, 1, 1, 1, 1, 1, 0, 0],
  1: [0, 1, 1, 0, 0, 0, 0, 0],
  2: [1, 1, 0, 1, 1, 0, 1, 0],
  3: [1, 1, 1, 1, 0, 0, 1, 0],
  4: [0, 1, 1, 0, 0, 1, 1, 0],
  5: [1, 0, 1, 1, 0, 1, 1, 0],
  6: [0, 0, 1, 1, 1, 1, 1, 0],
  7: [1, 1, 1, 0, 0, 0, 0, 0],
  8: [1, 1, 1, 1, 1, 1, 1, 0],
  9: [1, 1, 1, 1, 0, 1, 1, 0],
  a: [1, 1, 1, 0, 1, 1, 1, 0],
  b: [0, 0, 1, 1, 1, 1, 1, 0],
  c: [1, 0, 0, 1, 1, 1, 0, 0],
  d: [0, 1, 1, 1, 1, 0, 1, 0],
  e: [1, 0, 0, 1, 1, 1, 1, 0],
  f: [1, 0, 0, 0, 1, 1, 1, 0],
  g: [1, 1, 1, 1, 0, 1, 1, 0],
  h: [0, 1, 1, 0, 1, 1, 1, 0],
  i: [0, 1, 1, 0, 0, 0, 0, 0],
  j: [0, 1, 1, 1, 1, 0, 0, 0],
  k: [0, 1, 0, 1, 1, 1, 1, 0],
  l: [0, 0, 0, 1, 1, 1, 0, 0],
  m: [0, 0, 1, 0, 1, 0, 1, 0],
  n: [1, 1, 1, 0, 1, 1, 0, 0],
  o: [1, 1, 1, 1, 1, 1, 0, 0],
  p: [1, 1, 0, 0, 1, 1, 1, 0],
  q: [1, 1, 1, 0, 0, 1, 1, 0],
  r: [0, 0, 0, 0, 1, 0, 1, 0],
  s: [1, 0, 1, 1, 0, 1, 1, 0],
  t: [0, 0, 0, 1, 1, 1, 1, 0],
  u: [0, 1, 1, 1, 1, 1, 0, 0],
  v: [0, 1, 1, 1, 1, 1, 0, 0],
  w: [0, 0, 1, 1, 1, 0, 0, 0],
  x: [0, 1, 1, 0, 1, 1, 1, 0],
  y: [0, 1, 1, 1, 0, 1, 1, 0],
  z: [1, 1, 0, 1, 1, 0, 1, 0]
};

function cycleLedAsync(i) {
  lights[i].write(1, err => {
    if (err) {
      console.error(err);
    }
    setTimeout(() => {
      lights[i].write(0, err => {
        if (err) {
          console.error(err);
        }

        i += 1;
        if (i < lights.length) {
          cycleLedAsync(i);
        } else {
          showAlphabet('a', 0);
        }
      });
    }, 250);
  });
}

function showAlphabet(l, i) {
  lights[i].write(letters[l][i], err => {
    if (err) {
      throw err;
    }
    i += 1;
    if (i < lights.length) {
      showAlphabet(l, i);
    } else {
      const keys = Object.keys(letters);
      const nextIndex = keys.indexOf(l) +1;
      if (nextIndex < keys.length) {
        const nextLetter = keys[nextIndex];
        setTimeout(() => {
          showAlphabet(nextLetter, 0);          
        }, 250);
      } else {
        setTimeout(() => {
          cleanUp();          
        }, 250);
      }
    }
  });
}

function cleanUp() {
  lights.forEach(x => {
    x.writeSync(0);
    x.unexport();
  });
}

cycleLedAsync(0);
