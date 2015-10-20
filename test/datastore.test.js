define(function(require) {
	var Datastore = require("Datastore");

	describe("Datastore", function() {
		var saveFunc;
		var loadFunc;
		var datastore;
		var key = "arbitrary-key";
		var content = "blah blah, some content";

		beforeEach(function() {
			saveFunc = sinon.stub();
			loadFunc = sinon.stub();

			datastore = new Datastore(saveFunc, loadFunc);
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
		});
	});	
});
