require(["Throttler"], function(Throttler){
	describe("Throttler", function() {
		var throttler;
		var funcToThrottle;

		beforeEach(function() {
			funcToThrottle = sinon.stub();
			throttler = new Throttler(20, funcToThrottle);
		});

		describe("execute", function() {
			it("should return a promise", function() {
				var promise = throttler.execute();

				chai.assert.isObject(promise);
				chai.assert.isFunction(promise.done);
				chai.assert.isFunction(promise.then);
				chai.assert.isFunction(promise.fail);
			});

			it("should only call once when called within quiet period", function(done) {
				throttler.execute();
				throttler.execute();
				throttler.execute();
				throttler.execute().done(function() {
					chai.assert.ok(funcToThrottle.calledOnce);

					done();
				}).fail(function(reason) {
					throw reason;
				});
			});

			it("should pass along arguments", function(done) {
				var someObj = { "this": 178 };
				var someArr = [ "a", "b", "c"];
				throttler.execute("arg1", "arg2", 3, someObj, someArr).done(function(){
					chai.assert.ok(funcToThrottle.calledOnce);
					chai.assert.equal(funcToThrottle.args[0][0], "arg1");
					chai.assert.equal(funcToThrottle.args[0][1], "arg2");
					chai.assert.equal(funcToThrottle.args[0][2], 3);
					chai.assert.equal(funcToThrottle.args[0][3], someObj);
					chai.assert.equal(funcToThrottle.args[0][4], someArr);

					done();
				}).fail(function(reason) {
					throw reason;
				});
			});
		});
	});
});
