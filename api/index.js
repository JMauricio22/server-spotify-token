const express = require('express');
const http = require('http-request');
const dotenv = require('dotenv');
var querystring = require('querystring');
const app = express();

dotenv.config();

const client_secret = process.env.CLIENT_SECRET;

app.set('port', process.env.PORT || 3000);

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/api/token/:client_id', (req, res) => {
  const client_id = req.params.client_id;

  const reqBody = Buffer.from(
    querystring.stringify({
      grant_type: 'client_credentials',
    })
  );

  const headers = {
    Authorization:
      'Basic ' +
      Buffer.from(client_id + ':' + client_secret).toString('base64'),
    'Content-type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(reqBody),
  };

  http.post(
    {
      url: 'https://accounts.spotify.com/api/token',
      headers,
      reqBody: reqBody,
    },
    (err, response) => {
      if (err) {
        console.error(err);
        res.send(err);
        return;
      }
      console.log(response.code, response.headers, response.buffer.toString());
      res.send(response.buffer.toString('utf8'));
    }
  );
});

app.listen(app.get('port'), () => {
  console.log(`Server listening in port http://localhost:${app.get('port')}`);
});
