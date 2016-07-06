var express = require('express'), app = express()

app.get('/greet', function (req, res) {
  res.send('hello!');
})

app.listen(3000, function () { console.log('listening on 3000') })
