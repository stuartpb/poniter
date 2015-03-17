# fingerpoint.js

Fingerpoint is a UI library that implements lightweight, emphemeral routers for
pointers (mouse, touch, and stylus events).

## Requirements

fingerpoint expects the following features in the environment, which will need
to be polyfilled:

- ES6 Maps
- Pointer Events

## Pointer-independent events

These events involve the *notion* of pointers, but do not address *specific*
pointers.

### hover

The `hover` event is fired when an element is *first hovered over* by a
pointer (this includes being touched by a finger). It will not be triggered
again until a corresponding `clear` event fires.

### clear

The `clear` event is fired when *the last pointer over the element leaves*.
It is the counterpart event to `hover`.

## Initial events

Events an element can listen to for the introduction of a pointer: listening
within the scope of one of these events will scope the listener to that
pointer.

### enter

The `enter` event is fired when a pointer enters an element's hit-space, either
by hovering over it or touching it (the latter event being followed by a `down`
event).

This should not be used for hover effects unless they are pointer-specific
(such as expecting a drop): see the `hover` event for a multi-pointer-ready
hover event.

Handlers for this event may listen for `down`, `graze`, or `leave` events.

### down

This will clear any `graze` listener.

Handlers for this event may listen for `drag`, `drop`, `leave`, `reenter`, and
`release` events.

## Pointer continuations

### graze

Fired when the pointer moves after entering an element (after being listened
for in an `enter` event).

Handlers for this event may listen for `leave` events.

### drag

Fired when the pointer moves after a `down` event on the element, until the
pointer is released (potentially triggering a `drop` event, followed by a
guaranteed `release` event).

Handlers for this event may listen for `drop`, `leave`, `reenter`, and
`release` events.

### reenter

Fired when the pointer comes over an element being dragged that was previously
the target of a `down` event.

## Pointer finalizations

The following events will only occur once for a pointer without a corresponding
initial event.

### drop

This is listenable from a `down` event, and clears the `drag` listener
(as well as the `drop` listener).

This event is not guaranteed to fire after `down`, as a pointer may be
cancelled (eg. by a touchpad's palm rejection). See notes for `release`.

This event *does* fire after an element is clicked; if you wish to have a
different behavior on click for the element without triggering the drag
behavior, it is best to only set a drop behavior within a `drag` listener,
making sure that the cursor has moved significantly.

The `drag` and `drop` events are cleared after the `release` event fires
or would be fired.

### leave

This is the counterpart to `over`. For pointers that don't hover, this event
will be fired before `release`.

This will fire *as soon as the pointer leaves the element*: if you do not move
the element to be under the cursor in a `drag` handler, this event will fire.

As such, this does *not* clear the `drag` listener. It does clear the `graze`
listener, as well as the `leave` listener.

### release

This is listenable from a `down` event.

This may or may not follow a drop event: if this is fired without a
corresponding `drop`, the interaction should be treated as cancelled.

This clears the `drag` and (whether called or not) `drop` listeners, as well as
itself.
