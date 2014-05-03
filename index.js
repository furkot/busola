var Emitter = require('emitter');
var metric = require('spherical').distance;
var distance = require('./distance');

module.exports = directions;


var margin = {
 line: 20,   // max distance from the line segment for which we consider tracking this line
 point: 10   // max distance from the point in which we consider that we arrived
};

function pos2ll(pos) {
  return [pos.coords.longitude, pos.coords.latitude]; // x,y
}

// return index of the closest leg (only if < margin)
function find(pos, legs) {
  var result, ll = pos2ll(pos);

  // find closest point on the polyline
  result = legs.reduce(function(r, leg, index) {
    var closest, distance_2;

    closest = distance.closest(ll, leg.from, leg.to);
    distance_2 = distance.p2p_2(ll, closest);

    if (r.distance_2 === undefined || r.distance_2 > distance_2) {
      // found closer leg
      r.distance_2 = distance_2;
      r.closest = closest;
      r.index = index;
    }

    return r;
  }, {});

  // check if it's close enough
  if (metric(ll, result.closest) < margin.line) {
    return result.index;
  }
}

// decide if we are still on tracked leg or if we should move on to the next one
function detect(pos, legs, index) {
  var closest = find(pos, legs.slice(index, index + 1));
  if (typeof closest === 'number') {
    return closest + index;
  }
}


// emits the following events
// turn, follow, lost
function directions() {
  var self,
    my = {
      legs: []
    };

  function distanceToNextTurn(pos, leg) {
    return metric(pos2ll(pos), leg.to);
  }

  function emitFollow(pos, index) {
    var leg = my.legs[index];
    self.emit('follow', leg, distanceToNextTurn(pos, leg));
  }

  function emitTurn(index) {
    self.emit('turn', my.legs[index], my.legs[index + 1]);
  }

  function start(pos) {
    var current = find(pos, my.legs);
    if (typeof current === 'number') {
      emitFollow(pos, current);
    }
    return current;
  }

  function track(pos) {
    var current = detect(pos, my.legs, my.current);
    if (current === my.current) {
      emitFollow(pos, current);
    } else if (typeof current === 'number') {
      emitTurn(current);
    } else {
      self.emit('lost');
    }
    return current;
  }

  function end() {
    my.current = undefined;
  }

  function update(position) {
    if (typeof my.current !== 'number') {
      my.current = start(position);
    } else {
      my.current = track(position);
    }
  }

  self = {
    update: update,
    end: end
  };

  return Emitter(self);
}