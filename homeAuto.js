var flatiron = require('flatiron');
var app = flatiron.app;

var exec = require('child_process').exec;
var port = 8069;

app.use(flatiron.plugins.http);

app.router.get('/', function () {
  this.res.writeHead(200, { 'Content-Type': 'text/html' });
  this.res.end('' +
    '<p><a href="/options">GET: /options</a></p>' +
    '<p><a href="/devices/all">GET: /devices/all</a></p>' +
    '<p>PUT: /devices/</p>' +
    '<p>GET: /add/zigbee</p>' +
    '<p>GET: /change/:device/:value</p>' +
    '<p>GET: /devices/{deviceId}</p>' +
    '<p>UPDATE: /devices/{deviceId}</p>' +
    '<p>DEL: /devices/{deviceId}</p>' +
  '');
});

app.router.get('/devices/all', function () {
  var that = this;
  exec('aprontest -l', function(error, stdout, stderr) {
    that.res.writeHead(200, { 'Content-Type': 'text/plain' });
    that.res.end(stdout);
    //that.res.end('{"1":' + stdout + '}');
  });
});

//aprontest -u -m 4 -t 1 -v ON
//aprontest -u -m 4 -t 2 -v 255
app.router.get('/change/:deviceId/:value', function (deviceId, value) {
  var that = this;
  if(Number(value)){
    exec('aprontest -u -m ' + deviceId + ' -t 2 -v ' + value, function(error, stdout, stderr) {
      that.res.writeHead(200, { 'Content-Type': 'text/plain' });
      that.res.end(stdout);
    });
    return;
  }
  if(value === 'ON'){
    exec('aprontest -u -m ' + deviceId + ' -t 1 -v ON', function(error, stdout, stderr) {
      that.res.writeHead(200, { 'Content-Type': 'text/plain' });
      that.res.end(stdout);
    });
    return;
  }
  exec('aprontest -u -m ' + deviceId + ' -t 1 -v OFF', function(error, stdout, stderr) {
    that.res.writeHead(200, { 'Content-Type': 'text/plain' });
    that.res.end(stdout);
  });
});

//aprontest -a -r zigbee
app.router.get('/add/zigbee', function () {
  var that = this;
  exec('aprontest -a -r zigbee', function(error, stdout, stderr) {
    that.res.writeHead(200, { 'Content-Type': 'text/plain' });
    that.res.end(stdout);
  });
});

app.router.get('/options', function () {
  var that = this;
  exec('aprontest', function(error, stdout, stderr) {
    that.res.writeHead(200, { 'Content-Type': 'text/plain' });
    that.res.end(stdout);
  });
});

app.start(port);
console.log('flatiron started on port: ', port);