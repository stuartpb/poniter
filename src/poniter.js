// poniter Copyright 2015 Stuart P. Bentley <https://stuartpb.com>
// This work may be used freely as long as this notice is included.
// The work is provided "as is" without warranty, express or implied.

(function(){
"use strict";

let poniter = {};

poniter.listen = function PoniterListener(element) {
  let trackedPointerStates = new Map();
  let elementListeners = {};

  function trackedPointerState(pointerId) {
    let state = trackedPointerStates.get(pointerId);
    if (state) return state;
    else {
      state = {
        down: false,
        inside: false,
        listeners: {}
      };
      trackedPointerStates.set(pointerId,state);
      return state;
    }
  }

  function eventProxy(evt, state) {
    let proxy = Object.create(evt);
    //proxy.state = state;
    proxy.down = state.down;
    if (state.down) {
      proxy.downX = state.downX;
      proxy.downY = state.downY;
    }
    proxy.inside = state.inside;
    proxy.pon = (evtName, cb) => {
      state.listeners[evtName] = cb;
      return proxy;
    };
    return proxy;
  }

  function fireProxyAtListener(name, evt, state) {
    if (state.listeners[name]) {
      state.listeners[name](eventProxy(evt, state));
    } else if (elementListeners[name]) {
      elementListeners[name](eventProxy(evt, state));
    }
  }

  element.addEventListener('pointerenter', evt => {
    let state = trackedPointerState(evt.pointerId);
    state.inside = true;
    fireProxyAtListener('enter', evt, state);
  });

  element.addEventListener('pointerover', evt => {
    let state = trackedPointerState(evt.pointerId);
    fireProxyAtListener('over', evt, state);
  });

  element.addEventListener('pointerdown', evt => {
    let state = trackedPointerState(evt.pointerId);
    state.down = true;
    state.downX = evt.clientX;
    state.downY = evt.clientY;
    fireProxyAtListener('down', evt, state);
  });

  element.addEventListener('pointermove', evt => {
    let state = trackedPointerState(evt.pointerId);
    fireProxyAtListener('move', evt, state);
  });

  element.addEventListener('pointerout', evt => {
    let state = trackedPointerState(evt.pointerId);
    fireProxyAtListener('out', evt, state);
  });

  element.addEventListener('pointerup', evt => {
    let state = trackedPointerState(evt.pointerId);
    state.down = false;
    fireProxyAtListener('up', evt, state);
  });

  element.addEventListener('pointercancel', evt => {
    let state = trackedPointerState(evt.pointerId);
    fireProxyAtListener('cancel', evt, state);
  });

  element.addEventListener('gotpointercapture', evt => {
    let state = trackedPointerState(evt.pointerId);
    state.captured = true;
  });

  element.addEventListener('lostpointercapture', evt => {
    let state = trackedPointerStates.get(evt.pointerId);
    if (state) {
      if (state.inside) state.captured = false;
      else trackedPointerStates.delete(evt.pointerId);
    }
  });

  element.addEventListener('pointerleave', evt => {
    let state = trackedPointerStates.get(evt.pointerId);
    if (state) {
      if (state.captured) {
        state.inside = false;
      }

      fireProxyAtListener('leave', evt, state);

      if (!state.captured) {
        trackedPointerStates.delete(evt.pointerId);
      }
    } else if (elementListeners.leave) {
      elementListeners.leave(evt);
    }
  });

  let listenObject = {
    on: (evtName, cb) => {
      elementListeners[evtName] = cb;
      return listenObject;
    }
  };

  return listenObject;
};

function clientPointToSVGPoint(pt, svg) {
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function eventToSVGPoint(evt, prefix) {
  let svg = evt.target.ownerSVGElement;
  let pt = svg.createSVGPoint();
  if (prefix === '') prefix = {x: evt.x, y: evt.y};
  prefix = prefix || 'client';
  pt.x = prefix.x ? prefix.x : evt[prefix + 'X'];
  pt.y = prefix.y ? prefix.y : evt[prefix + 'Y'];
  return clientPointToSVGPoint(pt, svg);
}

poniter.svgPoint = {
  fromClientPoint: clientPointToSVGPoint,
  fromEvent: eventToSVGPoint
};

if(typeof module != "undefined") {
  module.exports = poniter;
} else {
  window.poniter = poniter;
}

})();
