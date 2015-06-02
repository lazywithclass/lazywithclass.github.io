# Download ajax calls responses for a set of pages

## The need

Have a demo copy of our frontend with static data.

## The solution

I wanted a reusable solution, something I could pass a set of URLs, something that could track each ajax request and give me access to the payload. That something is [CasperJS](http://casperjs.org/).

The hook I was looking for is an event called `resource.received` ([docs](http://docs.casperjs.org/en/latest/events-filters.html#events)), its callback receives a `resource` object which comes from PhantomJS as CasperJS just forwards the event ([docs](http://phantomjs.org/api/webpage/handler/on-resource-received.html)).

Here is the simplified version of the code I've used, with bonus code for the login:

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
    casper.thenOpen('http://example.com/' + arg, function() {});
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
