# poniter

Poniter is a UI library that implements lightweight, emphemeral routers for
pointers (mouse, touch, and stylus events).

## Requirements

Poniter expects the following features in the environment, which will need
to be polyfilled:

- ES6 Maps
- Pointer Events

Also note that, to get pointer events for touches, you will need to set
"touch-action" to "none" (either as a style or as an attribute, depending on
the way your polyfill works) on `<html>`, `<body>`, or any element you want
touch events to start from.

## Listening

To listen for poniter-enhanced pointer events, call `poniter.listen` with the
element you wish to listen to, then call ".on" methods for respective pointer
events:

```js
/*global poniter*/
poniter.listen(document.getElementById('example'))
  .on('enter', function(evt) {
    console.log('new pointer over example element');
  })
  .on('down', function(evt) {
    console.log('example element tapped');
  })
```

Any event can also listen to further events from the given pointer by using the
`pon` method of the event (you may wish to combine this with
`setPointerCapture`) - each `pon` call returns the original event, so multiple
`pon` calls may be chained:

```js
poniter.listen(document.getElementById('example'))
  .on('down', function(evt) {
    var downtime = Date.now();
    evt.target.setPointerCapture(evt.pointerId);
    evt.pon('up', function(evt) {
      var duration = (Date.now() - downtime) / 1000;
      console.log('Pointer dropped after ' + duration + ' seconds');
    }).pon('cancel',function(evt) {
      var duration = (Date.now() - downtime) / 1000;
      console.log('Pointer canceled after ' + duration + ' seconds');
    });
  });
```
