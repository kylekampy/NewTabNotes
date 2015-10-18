"use strict";

class Throttler {
	constructor(quietPeriod, funcToThrottle) {
		this.quietPeriod = quietPeriod;
		this.funcToThrottle = funcToThrottle;

		this.waitingFuncTimeout;
		this.waitingFuncDeferred;
	}

	execute() {
		var self = this;
		var deferred = $.Deferred();
		var passThroughArgs = arguments;

		if (this.waitingFuncTimeout) {
			window.clearTimeout(this.waitingFuncTimeout);
			this.waitingFuncDeferred.reject("A new request has started")
		}

		this.waitingFuncTimeout = window.setTimeout(function() {
			deferred.resolve(self.funcToThrottle.apply(self, passThroughArgs));
		}, this.quietPeriod);

		this.waitingFuncDeferred = deferred;
		return deferred.promise();
	}
}