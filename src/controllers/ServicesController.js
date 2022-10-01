const nodemailer = require("nodemailer");
const transporter = require("../config/nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, "..", "..", '.env') })

class ServicesController{
    async sendEmail(userInfo, token){
        const userName = "gilberto";
        const userEmail = "gibamedeirosgc@gmail.com";
        
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
            to: userEmail, 
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