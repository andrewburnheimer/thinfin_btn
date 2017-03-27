var http = require("http");
var fs = require("fs");
var url = require("url");
var pug = require("pug");
const querystring = require('querystring');

var typeHdrForFileExt = function(pathname){
  fileExtRegExp = RegExp("\\.[^.]+$");
  fileExt = fileExtRegExp.exec(pathname)[0];

  /* Thanks to https://annevankesteren.nl/2004/08/mime-types */
  switch(fileExt) {
    case ".html":
      return "text/html";
      break;
    case ".css":
      return "text/css";
      break;
    case ".js":
      return "text/javascript";
      break;
    case ".ico":
      return "image/x-icon";
      break;
    default:
      return "text/plain";
  }
};

http.createServer(function(request, response) {
  var headers = request.headers;
  var method = request.method;
  var reqUrl = url.parse(request.url);
  var body = [];
  var facilities = [];

  request.on("error", function(err) {
    console.error(err);
  }).on("data", function(chunk) {
    body.push(chunk);
  }).on("end", function(chunk) {
    body = Buffer.concat(body).toString();
  });

  response.on("error", function(err) {
    console.error(err);
  });

/* reqUrl:
 * {"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":"?with=this+that&the=other+thing","query":"with=this+that&the=other+thing","pathname":"/sub1/sub2/index.html","path":"/sub1/sub2/index.html?with=this+that&the=other+thing","href":"/sub1/sub2/index.html?with=this+that&the=other+thing"}
 * */
  var queryLength = 0;
  if (reqUrl.query) {
    queryLength = reqUrl.query.length;
  }
  console.log(method + ", " + reqUrl.pathname + ", query bytes: " + queryLength);

  var pathname = reqUrl.pathname;
  if(pathname == "/") { pathname = "/index"; }

  apiRegExp = RegExp("\\.json$");
  fileExtRegExp = RegExp("\\.");

  if(apiRegExp.test(pathname)){
    if(pathname == "/roomStatus.json"){
      var query = querystring.parse(reqUrl.query);
      result = new Object
      result.room = query.room;
      result.status = "unknown"; /* XXX Implement API here:  */
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(result));
    } else {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/html');
      errorResponse = notFoundErrorResponse("Endpoint");
      response.end(errorResponse());
    }

  } else if(fileExtRegExp.test(pathname)){
    fs.readFile("public" + pathname, function (err, content) {
      if(!err) {
        response.statusCode = 200;
        response.setHeader('Content-Type', typeHdrForFileExt(pathname));
        response.end(content);
      } else if(err.code == "ENOENT"){
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html');
        errorResponse = notFoundErrorResponse("Resource");
        response.end(errorResponse(err));
      } else {
        response.statusCode = 500;
        response.setHeader('Content-Type', 'text/html');
        errorResponse = otherServerErrorResponse();
        response.end(errorResponse({"details": err.toString()}));
      }
    });
  } else {
    response.setHeader('Content-Type', 'text/html');
    fs.readFile("app/views" + pathname + ".pug", function (err, content) {
      if(!err) {
        response.statusCode = 200;
        var compiledFunction = pug.compile(content);

        fs.readFile("facilities.json", function (err, content) {
          if(!err){
            facilities = eval("(" + content + ")");
            for (var idx in facilities) {
              facilities[idx].url = facilities[idx].remoteScheme + "://" + facilities[idx].host + ":" + facilities[idx].remotePort + "/" + facilities[idx].remotePath
            }
          } else {
            console.log("Error reading facilities.json: " + err.toString());
          }

          response.end(compiledFunction({ facilities: facilities }));
        })
      } else if(err.code == "ENOENT"){
        response.statusCode = 404;
        errorResponse = notFoundErrorResponse("View");
        response.end(errorResponse(err));
      } else {
        /*console.log("e: " + JSON.stringify(err));*/
        response.statusCode = 500;
        errorResponse = otherServerErrorResponse();
        response.end(errorResponse({"details": err.toString()}));
      }
    });
  }

}).listen(process.env.PORT || 8080);


function notFoundErrorResponse(pageType){
  if(typeof pageType == "undefined" || pageType == "") {
    pageType = "View";
  }
  var templateData = '';
  templateData += "doctype html\n";
  templateData += "html(lang=\"en\")\n";
  templateData += "  body\n";
  templateData += "  h1= \"" + pageType + " \" + path + \" not found\"";
  return pug.compile(templateData);
};

function otherServerErrorResponse(){
  var templateData = '';
  templateData += "doctype html\n";
  templateData += "html(lang=\"en\")\n";
  templateData += "  body\n";
  templateData += "  h1 Error reading file\n";
  templateData += "  h2= details";
  return pug.compile(templateData);
};

