var busola = require('..');

/* global describe, it */

describe('busola', function() {

	it('should emit lost when in doubt', function(done) {
		var l1 = {
			from: [23, 33],
			to: [40, 50]
		};

		busola([l1])
			.on('lost', function() {
				done();
			})
			.update({
				coords: {
					longitude: 0,
					latitude: 0
				}
			});
	});

	it('should emit follow when nearby', function(done) {
		var
			l1 = { from: [23, 33], to: [24, 35] };

		busola([l1])
			.on('follow', function(leg, distance) {
				leg.should.eql(l1);
				distance.should.be.above(240950);
				done();
			})
			.on('lost', function() {
				done('should not be lost');
			})
			.update({
				coords: {
					longitude: 23.0002,
					latitude: 32.99999
				}
			});
	});

	it('should emit follow and then turn when close to the turn', function(done) {
		var
			l1 = { from: [23, 33], to: [24, 35] },
			l2 = { from: [24, 35], to: [25, 37] };

		busola([l1, l2])
			.on('follow', function(leg, distance) {
				leg.should.eql(l1);
				distance.should.be.above(240950);
			})
			.on('turn', function(prev, next, distance) {
				prev.should.eql(l1, 'should be first leg');
				next.should.eql(l2, 'should be last leg');
				distance.should.be.above(240160);
				done();
			})
			.on('lost', function() {
				done('should not be lost');
			})
			.update({
				coords: {
					longitude: 23.0002,
					latitude: 32.99999
				}
			})
			.update({
				coords: {
					longitude: 24.00001,
					latitude: 34.99999
				}
			});
	});



});