import { query } from 'express';
import { validationResult } from 'express-validator';
import generator from 'generate-password';
import nodemailer from 'nodemailer';
import pool from '../db/dbConnection';

// Set the nodemailer transport object.
// Note: nodemailer needs a mail server to send emails through. I have a mailgun account registered 
//       with my own domain to send emails on RebackCrawlers behalf.

const transport = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: 'postmaster@redbackcrawler.je-it.com',
        pass: process.env.MAIL_PASS
    }
});

const passwordController = {

    // Reset the users password
    async resetPass(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).jsonp(errors.array());
        }

        try {
            const password = generator.generate({
                length: 8,
                numbers: true
            });

            const queryValues = [req.body.first_name, req.body.last_name, req.body.email, password];
            const queryResult = pool.query('SELECT * FROM resetPassword($1, $2, $3, $4)', queryValues);
            
            // Uppercase first letter of name for email 
            const emailName = req.body.first_name.charAt(0).toUpperCase() + (req.body.first_name).slice(1);

            // Check the DB function ran before sending email
            if ((await queryResult).rows[0].resetpassword == 'Password was reset') {
                await transport.sendMail({
                    from: 'no-reply@redbackcrawler.com', // Sender address that shows in receipents email client
                    to: req.body.email, 
                    subject: 'Redback Crawler Password Reset',
                    // Text for clients not supporting html
                    text: `Hi ${emailName}, \nYour password has been reset. \nPlease change this temporary password when you login. \nNew Password: ${password} \nThe Redback Crawler Team.`, 
                    // TODO read in the html content from another file. This is disgusting as one line.
                    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, initial-scale=1.0"/><style type="text/css"> @import url("https://fonts.googleapis.com/css2?family=Alata&amp;display=swap"); p { font-family: "Alata", sans-serif; font-weight: 200; font-size: 16px; padding-bottom: 20px; } #footer { font-size: 18px; } #pw { color: darkblue; } body {Margin: 0;padding: 0;}table {border-spacing: 0;}td {padding: 0;}img {border: 0;}@media screen and (max-width: 600px) { }@media screen and (max-width: 400px) { } </style></head> <body class="em_body" style="margin:0px; padding:0px;" bgcolor="#efefef"> <table align="center" width="700" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:700px; "> <tr> <td valign="bottom" align="left"> <div><p>Hi ${emailName},</p> <p>Your password has been reset. Please change this temporary password when you login</p> <p>New Password:</p> <p id="pw">${password}</p> </div> </td> <tbody><tr> <td valign="bottom" align="left"> <div><p id="footer">The Redback Crawler Team</p> </div> </td> <td valign="bottom" align="right"><img alt="Redback Crawler Logo" style="display:block;"src="https://iili.io/26NfI9.png" width="150" border="0" height="auto"/></td> </tr> </tbody> </tr> </table></body></html>`
                });
            }
            return res.status(200).json((await queryResult).rows);
        } catch (error) {
            console.log(error);
          return res.status(400).send({ message: 'Error with database query' });
        }
      },

      async updatePassword(req, res){
        const errros = validationResult(req);
        if (!errros.isEmpty()){
            return res.status(422).jsonp(errors.array());
        }
        try {
            const queryValues = [req.user.first_name, req.user.last_name, req.user.email, req.body.new_password];
            const queryResult = pool.query('SELECT * FROM resetPassword($1, $2, $3, $4)', queryValues);
            if ((await queryResult).rows[0].resetpassword == 'Password was reset') {
                return res.status(200).json({message: 'Password successfully changed'});
            } else {
                return res.status(400).send({message: 'Error changing password'});
            }
          
        } catch(error){
              console.log(error);
        }
      }
};
export default passwordController;