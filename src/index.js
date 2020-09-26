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
import { loggerMiddleware } from './logger/logger';

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

app.use('/api/demo', demoRouter); // This is a demo route that tells /api/demo route to use demoRouter which was imported top of file

// API routes

app.use('/api/login', loginRouter); // Login
app.use('/api/register', newUserRouter); //New user registraton

// Auth contains a next call that only happens if token is verified.
// if next gets called then this proceeds to the next route (authDemo).
app.use('/api/demo/auth', auth.checkJWT, authDemo); 


//app.use('/api/testauth', Auth.checkAuth, authTestRouter);

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
  