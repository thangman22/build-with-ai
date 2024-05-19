const express = require('express');
const path = require('path')
const {searchProcess} = require('./searchProcess.js')
const app = express();

const port = parseInt(process.env.PORT) || 8080;

app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'));
});

app.get('/api/searchProcess', async (req, res) => {
  if(req.query.q) {
    const sesarchResult = await searchProcess(req.query.q)
    res.json(sesarchResult);
  } else {
    res.json({ error: 'q parameter is require'})
  }

});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})