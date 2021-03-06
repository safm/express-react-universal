import path from 'path';
import express from 'express';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter as Router } from 'react-router';
import App from '../App';

const app = express();

app.use('/static', express.static(path.resolve(__dirname, '../../dist')));
app.get( '*', ( req, res ) => {
  const html = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html')).toString();
  const context = {};
  const markup = ReactDOMServer.renderToString(
    <Router location={req.url} context={context} >
      <App/>
    </Router>
  );

  if (context.url) {
    res.redirect(302, context.url);
  } else {
	  res.send(html.replace('$react', markup));
  }

} );

app.listen( 3000, () => {
	console.log( 'React app listening on port 3000!' )
} );