// the polyfills must be the first thing imported in node.js
import 'angular2-universal/polyfills';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as winston from 'winston';
import * as helmet from 'helmet';

import * as router from './routes/router';


// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { expressEngine } from 'angular2-universal';

// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

/*
 * Configure Winston
 */
winston.addColors({
    debug: 'green',
    info: 'cyan',
    silly: 'magenta',
    warn: 'yellow',
    error: 'red'
});
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: process.env.LOG_LEVEL,
    colorize: true
});

/*
 * Connect to database
 * Info: See database.ts to configure settings
 */
 import { Connect } from './database';

 Connect();

/*
 * Configure Express.js rendering engine
 */
app.engine('.html', expressEngine);
app.set('views', path.join(__dirname, '../../public/views'));
app.set('view engine', 'html');

/*
 * Configure Middleware
 */
app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use(helmet());

/*
 * Set directories to serve static assets from
 */
app.use(express.static(path.join(__dirname, '../../public'), {index: false}));
app.use('/assets/js', express.static(path.join(__dirname, '../../dist/client')));

/*
 * Routes
 */

import { ngApp } from './routes/ngApp';


// Put API routes here

/*
* Catch all for client side rendering
* Warning: Must be the last route!
*/
app.get('/*', ngApp);


/*
 * Server
 * Info: Runs on port 3000 if not set via environment variable
 */
let server = app.listen(process.env.PORT || 3000, () => {
  winston.info(`Listening at http://localhost:${server.address().port}`);
});
