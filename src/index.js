import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import demoRouter from './routes/demo';
import loginRouter from './routes/login';
import newUserRouter from './routes/newUser';
import healthRouter from './routes/health';
import auth from './middleware/authenticator';
import authDemo from './routes/authDemo';
import currencyRouter from './routes/currencyConversion';
import currencyController from './crawler/controllers/currencyController';
import resetPassRouter from './routes/resetPass';
import { loggerMiddleware } from './logger/logger';
import updatePassRouter from './routes/updatePass';
import adminRouter from './routes/admin';
import ebayRouter from './routes/ebay';
const cron = require('node-cron');


// Read in .env variables.
require('dotenv').config();

// Initialise Express.
const app = express();

app.use(loggerMiddleware);

// Handle JSON data and URL encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Add Helmet to enhance some of the API security.
app.use(helmet());

// The health API should have less CORS restrictions than the other routes.
app.use('/api/health', cors(), healthRouter);

// Cors setup. This create a whitlist of allowed remote sources. We don't want random
// remote websites to be able to query our API
// These whitelisted sources are read from our enviroment variables which in this case are
// set in Heroku itself.

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    const whitelist = [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL2,
      process.env.LH_URL,
      process.env.LH_URL2
    ];

    if (whitelist.indexOf(origin) !== -1 || !origin) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
};

// Enable CORS for all requests.
app.use(cors(corsOptions));

// API routes.
// This is a demo route that tells /api/demo route to use demoRouter which was imported top of file
app.use('/api/demo', demoRouter); 

// API routes

// Login
app.use('/api/user/login', loginRouter); 
//New user registraton
app.use('/api/user/register', newUserRouter); 
app.use('/api/user/resetpass', resetPassRouter);

// Auth contains a next call that only happens if token is verified.
// if next gets called then this proceeds to the next route (authDemo).
app.use('/api/demo/auth', auth.checkJWT, authDemo); 

app.use('/api/user/updatepass', auth.checkJWT, updatePassRouter);

app.use('/api/currency', currencyRouter);

app.use('/api/admin', auth.checkJWT, adminRouter);

app.use('/api/user/ebaylink', auth.checkJWT, ebayRouter);


// Root response to show Node is running when root url is visited in browser

app.get('/', (req, res) => res.send('Express is Running!'));

// Last route as a catch all if nothing above matched then return 404.
app.use((req, res) => {
    res.status(404).json({
      message: 'The requested resource doesn\'t exist.'
  
    });
  });
  
  // Start the server.
  app.listen(process.env.PORT || 3001, async () => {
    console.log('Server listening on port 3001');
  });


// import ebayCrawler from './crawler/ebayCrawler';
// ebayCrawler.crawlEbay("https://www.ebay.com.au/itm/Dell-G7-17-Gaming-Laptop-Intel-Core-i7-10750H-16GB-512GB-SSD-RTX-2070/392848668206?_trkparms=%26rpp_cid%3D5e9eb54bdac6250375030238%26rpp_icid%3D5e9eb54bdac6250375030237&_trkparms=pageci%3A3ce67d07-0cc9-11eb-b6f2-3ef42141b9ca%7Cparentrq%3A1e7e654f1750ace085d17050ffd6570e%7Ciid%3A2");
// ebayCrawler.crawlEbay("https://www.ebay.com.au/itm/REDRAGON-K552-Gaming-Mechanical-Wired-Splash-proof-Water-Keyboard-87-Keys-AU/164366714662?_trkparms=aid%3D1110009%26algo%3DSPLICE.COMPLISTINGS%26ao%3D1%26asc%3D228209%26meid%3Dcd7755a1130a44eca91534872e102344%26pid%3D100008%26rk%3D5%26rkt%3D12%26sd%3D392848668206%26itm%3D164366714662%26pmt%3D1%26noa%3D0%26pg%3D2047675%26algv%3Ddefault%26brand%3DRedragon&_trksid=p2047675.c100008.m2219");
// ebayCrawler.crawlEbay("https://www.ebay.com.au/itm/Xbox-One-X-1TB-Console-2-Controllers-3-Games-AUS-STOCK/193705414170?_trkparms=aid%3D777001%26algo%3DDISCO.FEED%26ao%3D1%26asc%3D228701%26meid%3D1a83934d559547e597e5a27be19fb558%26pid%3D100651%26rk%3D1%26rkt%3D1%26mehot%3Dnone%26itm%3D193705414170%26pmt%3D0%26noa%3D1%26pg%3D2380057%26algv%3DPersonalizedTopicsRefactor%26brand%3DMicrosoft&_trksid=p2380057.c100651.m4497&_trkparms=pageci%3A6f5f5bdd-0ce0-11eb-bc91-f2154f40abbd%7Cparentrq%3A1f166be31750a69d3f22fa11ffed3686%7Ciid%3A3");


// This will call the updateCurrencyData every 3 hours and update it. TODO: add some sort of fallback if this fails for some reason. 
cron.schedule('0 0 */3 * * *', function () {
  // Temp output to check it is functioning as expected once deployed for a few days.
  console.log("Cron Job about to run:");
  console.log(Date());
  currencyController.updateCurrencyData();
});



