var fs = require("fs");
var url = require("url");
var http = require("http");

const build = "C:/Dev/NodeJS/freddo_index2/react/freddo-index/build";

const config = JSON.parse(fs.readFileSync("routes.json"));
const routes = config.routes;
const classes = config.classes;

http.createServer(function (req, res) { testServerHandler(req, res); }).listen(80); //the server object listens on port 8080

function testServerHandler(req, res) {
    const pasrsedUrl = url.parse(req.url, true);
    const reasource = routes[pasrsedUrl.path];
    if(reasource) {
        fs.readFile(classes[reasource.class] + reasource.path, (err, data) => {
            if(!err) {
                res.writeHead(200, {'Content-Type': reasource.MIME});
                res.write(data);
            }
            else {
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.write('<!DOCTYPE html><html><body>Could not load resource.</body></html>');
            }
            return res.end();
        });
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write("<!DOCTYPE html><html><body>Error.</body></html>");
        return res.end();
    }
}
