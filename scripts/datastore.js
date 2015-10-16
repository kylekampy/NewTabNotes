"use strict";

class ThrottledDataStore {
	constructor(saveFunc, loadFunc, saveQuietPeriod, loadQuietPeriod) {
		this.saveFunc = saveFunc;
		this.loadFunc = loadFunc;
		this.saveQuietPeriod = saveQuietPeriod;
		this.loadQuietPeriod = loadQuietPeriod;

		this.runningSaveTimeout;
		this.runningSaveDeferred;
		this.runningLoadTimeout;
		this.runningLoadDeferred;

		this.firstLoad = false;
	}

	save(key, content) {
		var self = this;
		var deferred = $.Deferred();

		if (this.saveQuietPeriod > 0) {
			if (this.runningSaveTimeout) {
				window.clearTimeout(this.runningSaveTimeout);

				if (this.runningSaveDeferred) {
					this.runningSaveDeferred.reject();
				}
			}

			this.runningSaveTimeout = window.setTimeout(function() {
				self._doSave(key, content, deferred);
			}, this.saveQuietPeriod);
		} else {
			// For testing purposes, the set timeout can be
			// entirely omitted by setting the timeout to 0
			this._doSave(key, content, deferred);
		}
		this.runningSaveDeferred = deferred;

		return deferred.promise();
	}

	_doSave(key, content, deferred) {
		this.saveFunc(key, content, function() {
			deferred.resolve();
		});
	}

	load(key) {
		var self = this;
		var deferred = $.Deferred();

		if (this.loadQuietPeriod > 0) {
			if (this.runningLoadTimeout) {
				window.clearTimeout(this.runningLoadTimeout);

				if (this.runningLoadDeferred) {
					this.runningLoadDeferred.reject();
				}
			}

			this.runningLoadTimeout = window.setTimeout(function() {
				self._doLoad(key, deferred);
			}, this.loadQuietPeriod);
		} else {
			// For testing purposes, the set timeout can be
			// entirely omitted by setting the timeout to 0
			this._doLoad(key, deferred);
		}
		this.runningLoadDeferred = deferred;

		return deferred.promise();
	}

	_doLoad(key, deferred) {
		this.loadFunc(key, function(result) {
			deferred.resolve(result);
		});
	}
}
