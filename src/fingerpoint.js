// fingerpoint.js Copyright 2015 Stuart P. Bentley <https://stuartpb.com>
// This work may be used freely as long as this notice is included.
// The work is provided "as is" without warranty, express or implied.

(function(){
"use strict";

function FingerPoint(opts) {
  if (!this instanceof FingerPoint) return new FingerPoint(opts);

  opts = opts || {};
  opts.root = opts.root || window;

  // States per-element.
  let elementStates = new Map(); // should this be WeakMap?
  // States per-pointer.
  let pointerStates = new Map();

  document.addEventListener('pointerdown', (evt) => {
    //console.log('down',evt);
    let pointerState = pointerStates.get(evt.pointerId);
    if (!pointerState) {
      pointerState = {handlers: {}};
      pointerStates.set(evt.pointerId, pointerState);
    }
    pointerState.down = true;
    pointerState.downX = evt.clientX;
    pointerState.downY = evt.clientY;
    let proxy = Object.create(evt);
    let target = evt.target;
    let bubble = true;
    proxy.downX = evt.clientX;
    proxy.downY = evt.clientY;
    proxy.stopPropagation = () => {
      bubble = false;
    };
    proxy.pon = (eventType, cb) => {
      pointerState.downlock = target;
    };
    proxy.state = pointerState;
    while (bubble && target) {
      let elementState = elementStates.get(target);
      let hoverState = elementState && elementState.hovers.get(evt.pointerId);
      if (hoverState && hoverState.handlers.down) {
        hoverState.handlers.down(proxy);
      } else if (elementState && elementState.handlers.down) {
        elementState.handlers.down(proxy);
      }
      target = target.parentElement;
    }
  });
  document.addEventListener('pointermove', (evt) => {
    //console.log('move',evt);
    let pointerState = pointerStates.get(evt.pointerId);
    if (pointerState && pointerState.downlock &&
      pointerState.handlers.downmove) {

      let proxy = Object.create(evt);
      proxy.downX = pointerState.downX;
      proxy.downY = pointerState.downY;
      pointerState.handlers.downmove(proxy);
    } else {

    }
  });
  document.addEventListener('pointerover', (evt) => {
    //console.log('over',evt);
    let pointerState = pointerStates.get(evt.pointerId);


  });
  document.addEventListener('pointerout', (evt) => {
    //console.log('out',evt);
    let pointerState = pointerStates.get(evt.pointerId);

  });
  document.addEventListener('pointerup', (evt) => {
    //console.log('up',evt);
    let pointerState = pointerStates.get(evt.pointerId);


  });
  document.addEventListener('pointercancel', (evt) => {
    //console.log('cancel',evt);
    let pointerState = pointerStates.get(evt.pointerId);
    if (pointerState) {

    }
    pointerStates.delete(evt.pointerId);
  });
  this.listen = (elem, eventType, cb) => {
    let elementHandler = elementHandlers.get(elem);
    if (!elementHandler) {
      elementHandler = {};
      elementHandlers.set(elem, elementHandler);
    }
    elementHandler[eventType] = cb;
  };
  return this;
}

if(typeof module != "undefined") {
  module.exports = FingerPoint;
} else {
  window.FingerPoint = FingerPoint;
}

})();
