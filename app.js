const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.resolve(__dirname)))

app.set('port', 4000);

app.get('*', (req, resp) => {
  resp.sendFile(path.resolve(__dirname, 'index.html'))
})

app.listen(app.get('port'), () => console.log(`serv start.. http://localhost:${app.get('port')}/`))