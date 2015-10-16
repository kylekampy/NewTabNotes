describe("Throttled Datastore", function() {
	var saveFunc;
	var loadFunc;
	var datastore;
	var key = "arbitrary-key";
	var content = "blah blah, some content";

	beforeEach(function() {
		saveFunc = sinon.stub();
		loadFunc = sinon.stub();

		datastore = new ThrottledDataStore(saveFunc, loadFunc, 0, 0);
	});

	describe("save", function() {
		it("calls the save func with the key and content", function() {
			datastore.save(key, content);

			chai.assert.ok(saveFunc.calledOnce);
			chai.assert.equal(saveFunc.args[0][0], key);
			chai.assert.equal(saveFunc.args[0][1], content);
		});

		it("returns a promise", function() {
			var promise = datastore.save(key, content);

			chai.assert.isObject(promise);
			chai.assert.isFunction(promise.done);
			chai.assert.isFunction(promise.then);
			chai.assert.isFunction(promise.fail);
		});

		it("resolves the promise when saveFunc callback is called", function(done) {
			var promise = datastore.save(key, content);

			promise.done(function() {
				done();
			});

			saveFunc.args[0][2]();
		});

		describe("throttling", function() {
			var quietPeriod = 10;

			beforeEach(function() {
				datastore = new ThrottledDataStore(saveFunc, loadFunc, quietPeriod, 0);
			});

			it("will only save once if called multiple times within quiet period", function(done) {
				datastore.save(key, content);
				datastore.save(key, content);
				datastore.save(key, content);
				datastore.save(key, content);
				datastore.save(key, content);

				window.setTimeout(function() {
					try {
						chai.assert.ok(saveFunc.calledOnce);
						done();
					} catch(e) {
						done(e);
					}
				}, 15);
			});

			it("will reject other promises that got cancelled", function() {
				var promise1 = datastore.save(key, content);
				var promise2 = datastore.save(key, content);

				var failed1 = false;
				promise1.fail(function() {
					failed1 = true;
				});

				var failed2 = false;
				promise2.fail(function() {
					failed2 = true;
				});

				chai.assert.ok(failed1);
				chai.assert.notOk(failed2);
			});
		});
	});

	describe("load", function() {
		it("calls the load func with the correct key", function() {
			datastore.load(key)

			chai.assert.ok(loadFunc.calledOnce);
			chai.assert.equal(loadFunc.args[0][0], key);
		});

		it("returns a promise", function() {
			var promise = datastore.load(key);

			chai.assert.isObject(promise);
			chai.assert.isFunction(promise.done);
			chai.assert.isFunction(promise.then);
			chai.assert.isFunction(promise.fail);
		});

		it("resolves the promise with the content when the loadFunc callback is called", function(done) {
			var promise = datastore.load(key);

			promise.done(function(result) {
				chai.assert.equal(result, content);
				done();
			});

			loadFunc.args[0][1](content);
		});

		describe("throttling", function() {
			var quietPeriod = 10;

			beforeEach(function() {
				datastore = new ThrottledDataStore(saveFunc, loadFunc, 0, quietPeriod);
			});

			it("will only load once if called multiple times within quiet period", function(done) {
				datastore.load(key);
				datastore.load(key);
				datastore.load(key);
				datastore.load(key);
				datastore.load(key);

				window.setTimeout(function() {
					try {
						chai.assert.ok(loadFunc.calledOnce);
						done();
					} catch(e) {
						done(e);
					}
				}, 15);
			});

			it("will reject other promises that got cancelled", function() {
				var promise1 = datastore.load(key);
				var promise2 = datastore.load(key);

				var failed1 = false;
				promise1.fail(function() {
					failed1 = true;
				});

				var failed2 = false;
				promise2.fail(function() {
					failed2 = true;
				});

				chai.assert.ok(failed1);
				chai.assert.notOk(failed2);
			});
		});
	});
});