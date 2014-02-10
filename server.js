var PORT = process.env.PORT || process.argv[2] || 3000;
var DEBUG = true;

// dependencies
var express = require("express");
var nodetiles = require("nodetiles-core");
var projector = nodetiles.projector;
var fs = require("fs");
var cartoStyle = fs.readFileSync("./style.mss", "utf8");

// web serving
var app = module.exports = express();
app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.bodyParser({limit: "10mb"}));

app.configure("development", function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure("production", function(){
  app.use(express.errorHandler());
});


// Serve index.html
app.get("/", function(req, res) {
  res.sendfile(__dirname + "/index.html");
});

// Post some GeoJSON data to a tile coordinate, get a rendered tile back!
app.post('/tiles/:zoom/:x/:y.png', function(req, res) {
  var data = req.is("json") ? req.body : JSON.parse(req.body.data);
  var zoom = parseInt(req.params.zoom, 10),
      x = parseInt(req.params.x, 10),
      y = parseInt(req.params.y, 10),
      bounds = projector.util.tileToMeters(x, y, zoom);
  
  var map = new nodetiles.Map();
  map.addStyle(cartoStyle);
  map.addData({
    sourceName: "data", // for the stylesheet to use
    getShapes: function(minX, minY, maxX, maxY, mapProjection) {
      return projector.project[data.type]("EPSG:4326", mapProjection, data);
    }
  });
  
  map.render({
    bounds: {minX: bounds[0], minY: bounds[1], maxX: bounds[2], maxY: bounds[3]},
    width: 256,
    height: 256,
    zoom: zoom,
    callback: function(err, canvas) {
      res.type("png");
      canvas.createPNGStream().pipe(res);
    }
  });
});

// GO GO GO!
app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);
