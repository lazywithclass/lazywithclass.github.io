# Download responses of ajax calls for a set of pages

## The need

I needed to have 
To create a demo of our system I had the need to get all of our URLs along with the data returned, for each page.



```javascript
var fs = require('fs');
var casper = require('casper').create({
  verbose: false,
  logLevel: 'debug',
  webSecurityEnabled: false
});
casper.on('remote.message', function(msg) {
  this.echo('remote message caught: ' + msg);
});
var endpoints = [];
casper.on('resource.received', function(resource) {
  var status = resource.status;
  if (/\/api\/1/.test(resource.url) && endpoints.indexOf(resource.url) == -1) {
    endpoints.push(resource.url);
  }
});

casper.start('http://example.com/login', function() {
  casper.waitForSelector('body', function() {
    this.fillSelectors("form[name='login']", {
      'input[name=username]': 'root',
      'input[name=password]': 'toor'
    }, true);
  });
});

casper.then(function() {
  casper.cli.args.forEach(function(arg) {
    casper.thenOpen('http://elemez.com/' + arg, function() {});
  });
});

casper.then(function() {
  endpoints.forEach(function(endpoint) {
    this.echo(endpoint);
    this.download(endpoint, 'json' + fs.separator + filename(endpoint));
  }.bind(this));
});

function filename(endpoint) {
  return endpoint
    .replace('https://example.com/api/1/', '')
    .replace(/(.*)\?.*/, '$1')
    .replace(/\//g, '.');
}

casper.run();
```
