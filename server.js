var http = require("http");
var fs = require("fs");
var url = require("url");
var pug = require("pug");
const querystring = require('querystring');
var unirest = require('unirest');

var VER = "1.0.4";

var typeHdrForFileExt = function(pathname){
  var fileExtRegExp = RegExp("\\.[^.]+$");
  var fileExt = fileExtRegExp.exec(pathname)[0];

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
    case ".exe":
      return "application/x-msdownload";
      break;
    case ".pdf":
      return "application/pdf";
      break;
    default:
      return "application/octet-stream";
  }
};

var contDispHdrForFileExt = function(pathname){
  var fileExtRegExp = RegExp("\\.[^.]+$");
  var fileExt = fileExtRegExp.exec(pathname)[0];

  switch(fileExt) {
    case ".pdf":
      return "inline; filename=" + pathname.replace("/", "");
      break;
    default:
      return null;
  }
}

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
      var result = new Object

      if(method == "GET") {
        if(query.hasOwnProperty("room")) {

          result.room = query.room;

          var facility = new Object;
          fs.readFile("facilities.json", function (err, content) {
            array = eval("(" + content + ")");
            
            for (var i = 0, len = array.length; i < len; i++) {
              if(array[i].name == result.room) {
                facility = array[i];
                break;
              }
            }
            if(facility.hasOwnProperty("host")){

              unirest.get("http://" + facility.host + ":" + facility.sentryPort + "/NumOfRemoteAppUsers")
              .end(function (sentryResponse) {
                if(sentryResponse.ok) {
                  response.statusCode = 200;
                  
                  if(sentryResponse.body.NumOfRemoteAppUsers > 0) {
                    result.status = "busy";
                  } else {
                    result.status = "available";

                  }

                } else {
                  if(sentryResponse.error.hasOwnProperty("code")) {
                    response.statusCode = 200;
                    result.status = "unknown";
                    console.log("Can't connect to " + query.room + " StudioSentry: " + sentryResponse.error.code);
                  } else {
                    response.statusCode = 500;
                    result.status = "INTERNAL SERVER ERROR";
                    console.log("ERROR 500, " + query.room + " StudioSentry returning: HTTP " + sentryResponse.statusCode);
                  }
                }

                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify(result));
              });
            } else {
              response.statusCode = 404;
              result.status = "RESOURCE NOT FOUND";
              console.log("ERROR 404, resource " + result.room + " not found in facilities.json");
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify(result));
            }
          });

        } else {
          response.statusCode = 400;
          result.status = "BAD REQUEST NO PARAMS";
          console.log("ERROR 400, no query params sent for " + pathname);
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify(result));
        }
      } else {
        response.statusCode = 405;
        result.status = "METHOD NOT ALLOWED";
        console.log("ERROR 405, " + method + " not allowed for " + pathname);
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(result));
      }
    } else if(pathname == "/roomRemoteAppUser.json"){
      var query = querystring.parse(reqUrl.query);
      var result = new Object

      if(method == "DELETE") {
        if(query.hasOwnProperty("room")) {

          result.room = query.room;

          var facility = new Object;
          fs.readFile("facilities.json", function (err, content) {
            array = eval("(" + content + ")");
            
            for (var i = 0, len = array.length; i < len; i++) {
              if(array[i].name == result.room) {
                facility = array[i];
                break;
              }
            }
            if(facility.hasOwnProperty("host")){

              unirest.delete("http://" + facility.host + ":" + facility.sentryPort + "/KickRemoteAppUser")
              .end(function (sentryResponse) {
                if(sentryResponse.ok) {
                  response.statusCode = 204;
                } else {
                  response.statusCode = 500;
                  result.status = "INTERNAL SERVER ERROR";
                  console.log("ERROR 500, " + query.room + " StudioSentry returning: HTTP " + sentryResponse.statusCode);
                }

                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify(result));
              });
            } else {
              response.statusCode = 404;
              result.status = "RESOURCE NOT FOUND";
              console.log("ERROR 404, resource " + result.room + " not found in facilities.json");
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify(result));
            }
          });

        } else {
          response.statusCode = 400;
          result.status = "BAD REQUEST NO PARAMS";
          console.log("ERROR 400, no query params sent for " + pathname);
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify(result));
        }
      } else {
        response.statusCode = 405;
        result.status = "METHOD NOT ALLOWED";
        console.log("ERROR 405, " + method + " not allowed for " + pathname);
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(result));
      }
    } else {
      response.statusCode = 404;
      result = new Object
      result.status = "ENDPOINT NOT FOUND";
      console.log("ERROR 404, no endpoint for " + pathname);
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(result));
    }

  } else if(fileExtRegExp.test(pathname)){
    fs.readFile("public" + pathname, function (err, content) {
      if(!err) {
        response.statusCode = 200;
        response.setHeader('Content-Type', typeHdrForFileExt(pathname));

        var contDisp = contDispHdrForFileExt(pathname);
        if(contDisp) {
          response.setHeader('Content-Disposition', contDisp);
        }
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
              facilities[idx].url = facilities[idx].remoteScheme + "://" + facilities[idx].remoteHost + ":" + facilities[idx].remotePort + "/" + facilities[idx].remotePath
              facilities[idx].userUrl = facilities[idx].remoteScheme + "://" + facilities[idx].host + ":" + facilities[idx].remotePort + "/"
            }
          } else {
            console.log("Error reading facilities.json: " + err.toString());
          }

          response.end(compiledFunction({ facilities: facilities, version: VER }));
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
