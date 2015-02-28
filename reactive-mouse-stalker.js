'use strict';

var twemoji = require('twemoji');
var Bacon = require('baconjs');

var animationFrame = Bacon.fromBinder(function(sink) {
  var unsub;
  function next(t) {
    sink(t);
    unsub = requestAnimationFrame(next);
  }
  unsub = requestAnimationFrame(next);
  return unsub;
});

function Stalker(targetStream) {
  var elem = document.createElement('div');
  elem.style.position = 'absolute';
  elem.innerHTML = twemoji.parse('\u2b50');

  var position = { x: 400, y: 400 };
  elem.style.display = 'none';
  elem.style.left = position.x + 'px';
  elem.style.top = position.y + 'px';

  document.body.appendChild(elem);

  var initialized = false;

  var targetPosition = {x: 0, y:0};
  targetStream.onValue(function(p) {
    if (!initialized) {
      elem.style.display = '';
      initialized = true;
    }
    targetPosition.x = p.x;
    targetPosition.y = p.y;
  });

  var bound = 10;

  function next() {
    var xDiff = Math.abs(position.x - targetPosition.x);
    var yDiff = Math.abs(position.y - targetPosition.y);

    var xDir = position.x > targetPosition.x ? 1 : -1;
    var yDir = position.y > targetPosition.y ? 1 : -1;

    var distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

    var progress = Math.min(1.0, Math.max(0.0, distance / bound - 0.3));

    var relativeX = xDir * progress * bound * ( distance === 0 ? 1 : xDiff / distance );
    var relativeY = yDir * progress * bound * ( distance === 0 ? 1 : yDiff / distance );

    var newX = targetPosition.x + relativeX;
    var newY = targetPosition.y + relativeY;

    return {x: newX, y: newY};
  }

  var self = this;

  var ps = new Bacon.Bus();
  self.positionStream = ps.skipDuplicates();

  animationFrame.onValue(function() {
    if (initialized) {
      position = next();
      ps.push(position);
      elem.style.left = position.x + 'px';
      elem.style.top = position.y + 'px';
    }
  });
}

var mouseCursorStream =
  Bacon.fromEventTarget(document, 'mousemove').map(function(me) {
    return {
      x: me.clientX,
      y: me.clientY
    };
  });

module.exports = function() {
  var cur = new Stalker(mouseCursorStream);
  for (var i = 0; i < 30; i++) {
    cur = new Stalker(cur.positionStream.delay(100));
  }
};
