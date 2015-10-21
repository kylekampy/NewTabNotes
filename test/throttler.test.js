describe("Throttler", function() {
	var throttler;
	var funcToThrottle;
	var throttledFuncDeferred;

	beforeEach(function() {
		throttledFuncDeferred = $.Deferred();
		funcToThrottle = sinon.stub().returns(throttledFuncDeferred.promise());
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

			throttledFuncDeferred.resolve("yo dawg");
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

			throttledFuncDeferred.resolve("yo dawg");
		});

		it("should resolve it's promise when the caller promise resolves", function(done) {
			var promise = throttler.execute();

			promise.done(function(result) {
				chai.assert.result = "yo dawg";

				done();
			});

			throttledFuncDeferred.resolve("yo dawg");
		});

		it("should reject it's promise when the caller promise rejects", function(done) {
			var promise = throttler.execute();

			promise.fail(function(result) {
				chai.assert.result = "yo dawg";

				done();
			});

			throttledFuncDeferred.reject("yo dawg");
		});

		it("should notify it's promise when the caller promise notifies", function(done) {
			var promise = throttler.execute();

			promise.progress(function(result) {
				chai.assert.result = "yo dawg";

				done();
			});

			throttledFuncDeferred.notify("yo dawg");
		});
	});
});