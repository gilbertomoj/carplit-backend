const nodemailer = require("nodemailer");
const transporter = require("../config/nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, "..", "..", '.env') })

class ServicesController{
    async sendEmail(userInfo, token){
        const userName = "gmoj2@gmail.com";
        const userEmail = "thaisdekassia1@gmail.com";
        const emails = [userName, userEmail];
        transporter;    
        console.log(path.join(__dirname, '..', 'views'))

        transporter.use('compile', hbs({
            viewEngine: {
                extName: ".handlebars",
                partialsDir: path.join(__dirname, '..', 'views'),
                defaultLayout: false,
              },
              viewPath: path.join(__dirname, '..', 'views'),
              extName: ".handlebars",
        }));

        let mailOptions = {
            from: 'tabbnabbers@gmail.com', 
            to: emails, 
            subject: 'Alteração de Senha',
            text: '',
            template: 'index',
            context: {
                name: 'Accime Esterling',
                token: '2345678'
            } 
        };
        
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                return console.log(err);
            }
            return console.log('Email enviado!');
        });  
    }
}

module.exports = new ServicesController();