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
import ebayController from './crawler/controllers/ebayController'
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


// This calls a db function that will check if any links need to be updated according their individual update interval setting.

cron.schedule('0 0 */1 * * *', function () {
  // Temp output to check it is functioning as expected once deployed for a few days.
  console.log("Cron Job about to run (Check Ebay Links update method):");
  console.log(Date());
  ebayController.checkAge();
});

// This checks all links that are set with a notificaton, If the price has falls within a notifcation range send email
cron.schedule('0 0 */2 * * *', function () {
  // Temp output to check it is functioning as expected once deployed for a few days.
  console.log("Cron Job about to run (Check Ebay Links notification method):");
  console.log(Date());
  ebayController.checkNotifications();
});

// This will call the updateCurrencyData every 3 hours and update it. TODO: add some sort of fallback if this fails for some reason. 
cron.schedule('0 0 */3 * * *', function () {
  // Temp output to check it is functioning as expected once deployed for a few days.
  console.log("Cron Job about to run (Update Currency):");
  console.log(Date());
  currencyController.updateCurrencyData();
});



