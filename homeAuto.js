var flatiron = require('flatiron');
var app = flatiron.app;

var exec = require('child_process').exec;
var port = 8069;

app.use(flatiron.plugins.http);

process.title = 'Home Automation Service';

var routes = [{
  path: '/options',
  headers: { 'Content-Type': 'text/plain' },
  commandArgs: '',
}, {
  path: '/devices/all',
  headers: { 'Content-Type': 'text/plain' },
  commandArgs: '-l',
}, {
  path: '/add/zigbee',
  headers: { 'Content-Type': 'text/plain' },
  commandArgs: '-a -r zigbee',
}, {
  path: '/rename/:deviceId/:name',
  commandArgs: '-m {arg} --set-name "{arg}"'
}];

var routesHtml = routes.reduce(function(all, x){
  return all + '<p><a href="' + x.path + '">GET: ' + x.path + '</a></p>';
}, '')

app.router.get('/', function () {
  this.res.writeHead(200, { 'Content-Type': 'text/html' });
  this.res.end(routesHtml +
    '<p>GET: /change/:device/:value</p>' +
    '<p>--- NOT IMPLEMENTED ---</p>' +
    '<p>PUT: /devices/</p>' +
    '<p>GET: /devices/{deviceId}</p>' +
    '<p>UPDATE: /devices/{deviceId}</p>' +
    '<p>DEL: /devices/{deviceId}</p>' +
  '');
});

routes.forEach(function(x) {
  app.router.get(x.path, function () {
    var that = this;
    var commandArgs = x.commandArgs;
    arguments.forEach(function(arg, i){
      commandArgs = commandArgs.replace('{arg}', arguments[i]);
    });
    exec('aprontest ' + commandArgs, function(error, stdout, stderr) {
      that.res.writeHead(200, x.headers);
      that.res.end(stdout + '\n\n' + commandArgs);
    });
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

app.start(port);
console.log('flatiron started on port: ', port);