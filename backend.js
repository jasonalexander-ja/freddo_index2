var fs = require("fs");
var url = require("url");
var http = require("http");

http.createServer(function (req, res) { serverHandler(req, res); }).listen(80); //the server object listens on port 8080

function serverHandler(req, res) {
    var pasrsedUrl = url.parse(req.url, true); 
    if(pasrsedUrl.pathname == "/")
    {
        fs.readFile("pages/index.html", function(err, data) { // Reads the relevant file
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
    else if(pasrsedUrl.pathname == "/favicon.png")
    {
        fs.readFile("Images/favicon.png", function(err, data) { // Reads the relevant file
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            res.writeHead(200, {'Content-Type': 'image/x-icon'});
            res.write(data);
            return res.end();
        });
    }
    else if(pasrsedUrl.pathname == "/favicon.ico")
    {
        fs.readFile("Images/favicon.ico", function(err, data) { // Reads the relevant file
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            res.writeHead(200, {'Content-Type': 'image/x-icon'});
            res.write(data);
            return res.end();
        });
    }
    else if(pasrsedUrl.pathname == "/index.js")
    {
        fs.readFile("scripts/index.js", function(err, data) { // Reads the relevant file
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            return res.end();
        });
    }
    else if(pasrsedUrl.pathname == "/change-points.json")
    {
        fs.readFile("data/change-points.json", function(err, data) { // Reads the relevant file
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            res.writeHead(200, {'Content-Type': 'text/json'});
            res.write(data);
            return res.end();
        });
    }
    else {
        fs.readFile("pages/error.html", function(err, data) { // Reads the relevant file
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
}