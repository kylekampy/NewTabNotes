var Throttler = (function() {
	"use strict";

	function Throttler(quietPeriod, funcToThrottle) {
		this.quietPeriod = quietPeriod;
		this.funcToThrottle = funcToThrottle;

		this.waitingFuncTimeout;
		this.waitingFuncDeferred;
	}

	Throttler.prototype.execute = function() {
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

	return Throttler;
})();
