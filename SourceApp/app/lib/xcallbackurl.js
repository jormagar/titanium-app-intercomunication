"use strict";

/**
 * @class XCallbackURL
 * @description Obtenemos parámetros de x-callback
 * @param {Object} url
 */
function XCallbackURL(url) {
	this.url = url;
	this.parsedURI = parseUri(url);
}

XCallbackURL.prototype.getURL = function(){
	return this.url;
};

XCallbackURL.prototype.getParsedURL = function(){
	return this.parsedURI;
};

XCallbackURL.prototype.isCallbackURL = function() {
	return this.parsedURI.host.toLowerCase() === 'x-callback-url';
};

XCallbackURL.prototype.action = function() {
	return this.parsedURI.file;
};

XCallbackURL.prototype.param = function(key) {
	if (this.parsedURI.queryKey && this.parsedURI.queryKey[key]) {
		return unescape(this.parsedURI.queryKey[key]);
	}
	return null;
};

XCallbackURL.prototype.hasSource = function() {
	return this.param('x-source') ? true : false;
};

XCallbackURL.prototype.source = function() {
	return this.param('x-source');
};

XCallbackURL.prototype.hasCallback = function() {
	return this.param('x-success') ? true : false;
};

XCallbackURL.prototype.callbackURL = function(params) {
	var url,
	    item;
	url = this.param('x-success');
	if (!url) {
		return url;
	}
	url += "?";
	for (item in params) {
		url += (item + "=" + escape(params[item]) + "&");
	}
	return url;
};

XCallbackURL.prototype.hasErrorCallback = function() {
	return this.param('x-error') ? true : false;
};

XCallbackURL.prototype.errorCallbackURL = function(xsource, code, msg) {
	var url = this.param('x-error');
	url += "?x-source="+ xsource;
	url += "&errorCode=" + code;
	url += "&errorMessage=" + escape(msg);
	return url;
};

// based on : http://blog.stevenlevithan.com/archives/parseuri
function parseUri(str) {
	var o = parseUri.options,
	    m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
	    uri = {},
	    i = 14;

	while (i--)
	uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
		if ($1)
			uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = {
	strictMode : true,
	key : ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
	q : {
		name : "queryKey",
		parser : /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser : {
		strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

module.exports = XCallbackURL;