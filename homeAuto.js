var flatiron = require('flatiron');
var app = flatiron.app;

var exec = require('child_process').exec;
var port = 8069;

app.use(flatiron.plugins.http);

process.title = 'Home Automation Service';

var routes = [{
  path: '/',
  headers: { 'Content-Type': 'text/html' },
  html: '' +
    '</br><p>--- NOT IMPLEMENTED ---</p>' +
    '<p>group CRUD?</p>' +
    '<p>link controller to group/lights?</p>' +
    '<p>force refresh?</p>' +
    '<p>test radio/device?</p>' +
    ''
}, {
  path: '/options',
  headers: { 'Content-Type': 'text/plain' },
  commandArgs: '',
}, {
  path: '/add/zigbee',
  headers: { 'Content-Type': 'text/plain' },
  commandArgs: '-a -r zigbee',
}, {
  path: '/devices/all',
  headers: { 'Content-Type': 'text/plain' },
  commandArgs: '-l',
}, 
// parameterized routes
{
  path: '/devices/:deviceId',
  headers: { 'Content-Type': 'text/plain' },
  commandArgs: '-l -m {arg}',
}, {
  // double underscore is replaced by space
  path: '/rename/:deviceId/:name',
  commandArgs: '-m {arg} --set-name "{arg}"'
}, {
  path: '/change/:deviceId/:attr/:value',
  commandArgs: '-u -m {arg} -t {arg} -v {arg}'
}, {
  path: '/delete/:deviceId',
  commandArgs: '-m {arg} -d'
}];

var routesHtml = routes
  .filter(function(el, i){ return i > 0; })
  .reduce(function(all, x){
    return all + '<p><a href="' + x.path + '">' + x.path + '</a></p>';
  }, '');

routes.forEach(function(x) {
  app.router.get(x.path, function () {
    var that = this;
    if(x.path === '/'){
      this.res.end(routesHtml + (x.html || ''));
      return;
    }
    var commandArgs = x.commandArgs;
    [].slice.call(arguments).forEach(function(arg, i){
      commandArgs = commandArgs.replace('{arg}', (arg+'').replace(/__/g, ' '));
    });
    exec('aprontest ' + commandArgs, function(error, stdout, stderr) {
      that.res.writeHead(200, x.headers);
      that.res.end(stdout + '\n\n Command Args:' + commandArgs);
    });
  });
});

app.start(port);
console.log('flatiron started on port: ', port);