
# busola

  Track along polyline by generating events in response to position changes.

## Installation

  Install with [component(1)](http://component.io):

    $ component install furkot/busola

## API

```javascript
var busola = require('busola')(legs);

busola
  .on('lost', function() {
    console.log('Not sure where to go');
  })
  .on('turn', function() {
    console.log('turn now!')
  })

busola.update(positon)
```

Basic data structures

- `point` - is an Array [x, y] - first element represents the latitude, second -- longitude
- `leg` is a line segment described by 2 points `from` and `to`

### busola(legs)

Create a busola with a polyline represented by legs Array.

### update(position)

Notify busola about the new [`position`](https://developer.mozilla.org/en-US/docs/Web/API/Position)
One or more events can be generated as the result of updating the position

## Events

### lost

Generate is busola have no idea where you are related to polyline. Usually means you are to far
away.

### follow(leg, distance)

Follow the current `leg`, the next `leg` will start in `distance` (meters).

### turn(prev, next, distance)

You are at the turning point - you were following the `prev` leg, but now it's time to follow the
`next` leg (for at least a `distance` meters.)


## License

  The MIT License (MIT)

  Copyright (c) 2014 <copyright holders>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.