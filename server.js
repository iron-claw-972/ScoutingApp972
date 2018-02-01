var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

http.createServer(function(req, res) {

	function returnPage(filepath) {
		fs.readFile(filepath, function(err, data) {
			if (err) {
				res.writeHead(404, {
					'Content-Type': 'text/html'
				});
				return res.end("404 Not Found");
			}
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			return res.end(data);
		});
	}

	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});

	var pathname = url.parse(req.url, true).pathname;
	var search = url.parse(req.url, true).search;

	if (req.method == 'GET') {

		if (pathname == "/" || pathname.includes("/index")) {
			returnPage("./frontend/index.html");
			return;
		}

		if (pathname.includes("/submit")) {
			returnPage("./frontend/submit/index.html");
			return;
		}

	} else if (req.method == "POST") {

		if (pathname.includes("action")) {

			var body = req.body;
			req.on('data', function(data) {
				body += data;
			});

			req.on('end', function() {
				var post = querystring.parse(body);
				console.log('post: ' + JSON.stringify(post));

			});
			returnPage("./frontend/formSubmitted/index.html");
			return;
		}
	}

	return res.end();

}).listen(8080);