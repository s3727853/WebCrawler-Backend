import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig'

const Auth = {
 checkJWT(req, res, next){
     const { token } = req.headers;

     if(!token) {
         return res.status(403).send({ auth: false, message: 'No token provided'});
     }

     try {
         jwt.verify(token, jwtConfig.jwtSecret, (err, decoded) => {
             if(err) {
                 return res.status(400).send({ auth: false, message: 'Token provided is invalid' });
             }
             req.user = { email: decoded.email, role: decoded.role, auth: true};
             next();
         });
     } catch (error) {
         return res.status(400);
     }

}};

export default Auth;