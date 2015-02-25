(function() {
  'use strict';

  var Bacon = require('baconjs');

  var mousePointer = {x: 500, y: 500};
  Bacon.fromEventTarget(document, 'mousemove').onValue(function(me) {
    mousePointer.x = me.clientX;
    mousePointer.y = me.clientY;
  });

  var animationFrame = Bacon.fromBinder(function(sink) {
    var unsub;
    function next(t) {
      sink(t);
      unsub = requestAnimationFrame(next);
    }
    unsub = requestAnimationFrame(next);
    return unsub;
  });

  var timer = Bacon.interval(100, true);

  function Stalker(offsetX, offsetY, bound) {
    var elem = document.createElement('div');
    elem.style.position = 'absolute';
    elem.textContent = '☆';

    var p = { x: 400, y: 400 };
    elem.style.left = p.x + 'px';
    elem.style.top = p.y + 'px';

    document.body.appendChild(elem);

    function next() {
      var xDiff = Math.abs(p.x - mousePointer.x);
      var yDiff = Math.abs(p.y - mousePointer.y);

      var xDir = p.x > mousePointer.x ? 1 : -1;
      var yDir = p.y > mousePointer.y ? 1 : -1;

      var distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

      var progress = Math.min(1.0, Math.max(0.0, distance / bound - 0.05));

      var relativeX = xDir * progress * bound * ( distance === 0 ? 1 : xDiff / distance );
      var relativeY = yDir * progress * bound * ( distance === 0 ? 1 : yDiff / distance );
      console.log('d', distance, xDiff, yDiff);
      console.log(mousePointer.x + relativeX - p.x, mousePointer.y + relativeY - p.y);

      var newX = mousePointer.x + relativeX;
      var newY = mousePointer.y + relativeY;

      return {x: newX, y: newY};
    }

    animationFrame.onValue(function() {
      p = next();
      elem.style.left = p.x + offsetX + 'px';
      elem.style.top = p.y +  offsetY + 'px';
    });
  }

  new Stalker(10, 10, 30);
  new Stalker(10, 10, 50);
  new Stalker(10, 10, 70);
  new Stalker(10, 10, 90);
  new Stalker(10, 10, 90);
})();
