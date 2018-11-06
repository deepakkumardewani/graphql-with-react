const app = require('./server/server')
const { dump } = require('dumper.js');

global.dump = dump
app.listen(4000, () => {
  console.log('Listening')
})
