"use strict";

class Datastore {
	constructor(saveFunc, loadFunc) {
		this.saveFunc = saveFunc;
		this.loadFunc = loadFunc;
	}

	save(key, content) {
		var self = this;
		var deferred = $.Deferred();

		this.saveFunc(key, content, function() {
			deferred.resolve();
		});

		return deferred.promise();
	}

	load(key) {
		var self = this;
		var deferred = $.Deferred();

		this.loadFunc(key, function(result) {
			deferred.resolve(result);
		});

		return deferred.promise();
	}
}
