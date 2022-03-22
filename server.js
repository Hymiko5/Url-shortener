require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser')
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const links = [];
const id = 0;


app.use(cors(), bodyParser.urlencoded({ extended: false }));



app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params;
  const shortUrl = links.find(link => link["short_url"] == id);
  console.log(shortUrl);
  if(shortUrl){
    return res.redirect(shortUrl["original_url"]);
  } else {
    return res.json({
      error: "No short url"
    });
  }
  
});


app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
  if(!regex.test(originalUrl))
  {
    return res.json({
        "error":"Invalid URL"
      });
  }
  const urlObject = new URL(originalUrl);
  dns.lookup(urlObject.hostname, (err, address, family) => {
    if(err){
      return res.json({
        "error":"Invalid URL"
      })
    } else {
      let randomNumber = Math.floor(Math.random() * 100).toString();
      const shortedUrl = {
        "short_url": randomNumber,
        "original_url": urlObject.href
      }
      links.push(shortedUrl);
      return res.json(shortedUrl);
    }
});
});


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
