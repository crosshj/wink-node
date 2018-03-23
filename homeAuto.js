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
  headers: { 'Content-Type': 'application/json' },
  commandArgs: "-l  | awk '/LUTRON \\||ZIGBEE \\|/'",
  parseOutput: function(output){
    var result = output
      .split('\n')
      .filter(function(x){ return !!x})
      .map(function(x){
        var fields = x.split('|');
        var device = {
          id: Number(fields[0]),
          type: fields[1].trim(),
          name: fields[2].trim()
        };
        return device;
      });
    return JSON.stringify(result);
  }
}, 
// parameterized routes
{
  path: '/devices/:deviceId',
  headers: { 'Content-Type': 'text/plain' },
  commandArgs: '-l -m {arg}',
}, {
  path: '/refresh/:deviceId',
  headers: { 'Content-Type': 'text/plain' },
  commandArgs: '-m {arg} -E',
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
      const argValue = typeof arg === 'string' && (arg.toLowerCase() === 'on' || arg.toLowerCase() === 'off')
        ? arg.toUpperCase()
        : arg;
      commandArgs = commandArgs.replace('{arg}', (argValue+'').replace(/__/g, ' '));
    });
    exec('aprontest ' + commandArgs, function(error, stdout, stderr) {
      //TODO: error case
      that.res.writeHead(200, x.headers);
      var output = x.parseOutput
        ? x.parseOutput(stdout)
        : stdout;
      if(x.headers['Content-Type'] !== 'application/json'){
        output = 'Command: aprontest ' + commandArgs + '\n\n' + output;
      }
      that.res.end(output);
    });
  });
});

app.start(port);
console.log('flatiron started on port: ', port);