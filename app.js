var fs = require('fs');
var config = require('./config');

var url = require('url');
var http = require('http');

var graph = require('fbgraph');
graph.setAccessToken(config.fbAccessToken);

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static', {
	'index': ['index.html', 'index.htm']
});
var serve = serveStatic("static");

var server = http.createServer(function(req, res) {
	if (req.url.indexOf("/proxy/") === 0) {
		req.url = req.url.substring("/proxy/".length);
		var reqUrl = url.parse(req.url);
		var domain = reqUrl.protocol + "//" + reqUrl.host;
		console.log("proxy: request " + reqUrl.path +
		            " from " + domain);
		proxy.web(req, res, {
			changeOrigin: true,
			target: domain
		}, function(e) {
			console.log(e);
		});	
	} else if (req.url.indexOf("/facebook/") === 0) {
		var fbQuery = req.url.substring("/facebook".length);
		graph.get(fbQuery, function(fbErr, fbRes) {
			var fbJson = JSON.stringify(fbRes);
			console.log("facebook: " + fbJson);
			res.write(fbJson);
			res.end();
		});
	} else {
		var done = finalhandler(req, res);
		serve(req, res, done);
	}
});

server.listen(8000);
