define("Datastore", function() {
	return function Datastore(saveFunc, loadFunc) {
		this.saveFunc = saveFunc;
		this.loadFunc = loadFunc;
		
		this.save = function(key, content) {
			var self = this;
			var deferred = $.Deferred();

			this.saveFunc(key, content, function() {
				deferred.resolve();
			});

			return deferred.promise();
		}

		this.load = function(key) {
			var self = this;
			var deferred = $.Deferred();

			this.loadFunc(key, function(result) {
				deferred.resolve(result);
			});

			return deferred.promise();
		}
	}
});
